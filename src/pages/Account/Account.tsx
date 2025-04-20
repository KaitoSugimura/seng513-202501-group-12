import AuthCard from "../../components/Auth/AuthCard";
import Button from "../../components/Button";
import { Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Account.module.css";
import QuizListViewer from "../../components/QuizListViewer";
import { Query } from "appwrite";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { databases, storage, account, dbId, User, Quiz, getImgUrl } from "../../util/appwrite";
import { NavLink, useNavigate } from "react-router-dom";

export default function Account() {
  const location = useLocation();
  const viewUsername = location.state;
  const [userReady, setUserReady] = useState(!viewUsername);
  const { user, loadingAuth, setUser, logout } = useAuth();
  const [viewUser, setViewUser] = useState<User | null>(null);
  const displayUser = viewUser || user;
  const [isFriend, setIsFriend] = useState(false);
  const [loadingUser, setLoadingUser] = useState(0);
  const [createdQuizzes, setcreatedQuizzes] = useState<Quiz[] | null>(null);
  const [activeTab, setActiveTab] = useState<"createdQuizzes" | "users">(
    "createdQuizzes"
  );
  const [userList, setUserList] = useState<User[] | null>(null);
  const [userSearchInput, setUserSearchInput] = useState("");
  const [offset, setOffset] = useState(0);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteInProg, setDeleteInProg] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getViewUserProfile = async () => {
      try {
        const response = await databases.listDocuments(dbId, "users", [
          Query.equal("username", [viewUsername]),
        ]);
        if (response.documents.length === 1) {
          setViewUser(response.documents[0] as User);
        } else {
          setViewUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user information:", err);
      } finally {
        setUserReady(true);
      }
    };
    if (viewUsername) {
      getViewUserProfile();
    }
  }, [viewUsername]);

  useEffect(() => {
    setLoadingUser(1);
    const fetchCreatedQuizzes = async () => {
      try {
        const quizzes = await databases.listDocuments(dbId, "quizzes", [
          Query.contains("creatorUsername", [displayUser.username]),
        ]);
        setcreatedQuizzes(quizzes.documents as Quiz[]);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
      } finally {
        setLoadingUser(0);
      }
    };

    if (user && displayUser) {
      setIsFriend(user.friendIds?.includes(displayUser.$id));
      fetchCreatedQuizzes();
      if (user.admin) {
        getUsers();
      }
    }
  }, [user, displayUser]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getUsers(userSearchInput);
    }, 300); 
  
    return () => clearTimeout(delayDebounce);
  }, [userSearchInput, offset]);

  const getUsers = async (searchValue: string = "") => {
    try {
      const queries = [
        Query.limit(10),
        Query.offset(offset),
      ];
  
      if (searchValue !== "") {
        queries.push(Query.search("username", searchValue));
      }

      const users = await databases.listDocuments(
        dbId, 
        "users", 
        queries
      );
      setUserList(users.documents as User[])
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    }
  };

  const addFriend = async (id: string) => {
    if (user) {
      try {
        const updatedFriendIds = user.friendIds;
        updatedFriendIds.push(id);
        const updatedUser: User = await databases.updateDocument(
          dbId,
          "users",
          user.$id,
          { friendIds: updatedFriendIds }
        );
        setIsFriend(true);
        setUser(updatedUser);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    }
  };

  const removeFriend = async (id: string) => {
    if (user) {
      try {
        const updatedFriendIds =
          user.friendIds?.filter((friendId) => friendId !== id) || [];
        const updatedUser: User = await databases.updateDocument(
          dbId,
          "users",
          user.$id,
          { friendIds: updatedFriendIds }
        );
        setIsFriend(false);
        setUser(updatedUser);
      } catch (err) {
        console.error("Failed to remove friend:", err);
      }
    }
  };

  const deleteUser = async(id: string) => {
    setDeleteInProg(true); 
    const deletingUser : User = await databases.getDocument(dbId, "users", id)

    if(user?.admin) {
      try {
        const userQuizzes = await databases.listDocuments(dbId, "quizzes", [Query.equal("creatorId", deletingUser.$id)])
        userQuizzes.documents.forEach(async (quiz) => {deleteQuiz(quiz as Quiz)})

        const userHistory = await databases.listDocuments(dbId, "quizHistory", [Query.equal("userId", deletingUser.$id)])
        userHistory.documents.forEach(async (quizHist) => {await databases.deleteDocument(dbId, "quizHistory", quizHist.$id)})

        if (deletingUser.favoritedQuizIds.length > 0) {
          await Promise.all(
            deletingUser.favoritedQuizIds.map(async (quizId: string) => {
              try {
                const quiz = await databases.getDocument(dbId, "quizzes", quizId);
                const currentFavCount = quiz.favoritedCount || 0;
                const newFavCount = Math.max(0, currentFavCount - 1); 
  
                await databases.updateDocument(dbId, "quizzes", quizId, {
                  favoritedCount: newFavCount,
                });
              } catch (err) {
                console.error(`Failed to update favourite count for quiz ${quizId}:`, err);
              }
            })
          );
        }

        const allUsers = await databases.listDocuments(dbId, "users");
        (allUsers.documents as User[]).forEach(async (otherUser) => {
          const friendIds = otherUser.friendIds || [];
  
          if (friendIds.includes(deletingUser.$id)) {
            const updatedFriendIds = friendIds.filter((friendId: string) => friendId !== deletingUser.$id);
  
            await databases.updateDocument(dbId, "users", otherUser.$id, {
              friendIds: updatedFriendIds,
            });
          }
        })

        if(deletingUser.profilePictureId) {
          await storage.deleteFile("images", deletingUser.profilePictureId)
        }

        await databases.deleteDocument(dbId, "users", deletingUser.$id)
        const response = await account.deleteIdentity(deletingUser.$id)
        console.log(response)
      } catch (err) {
        console.error("Failed to delete user:", err);
      } finally {
        setDeleteUserId(null)
        setDeleteInProg(false)
        getUsers()
        if(user.$id != displayUser?.$id) {
          navigate("/account", { state: user?.username });
        }
      }
    }
  }

  const deleteQuiz = async (quiz : Quiz) => {
    try {
      const correspondingQuizHistories = await databases.listDocuments(
        dbId,
        "quizHistory",
        [Query.equal("quizId", quiz.$id)]
      );
      correspondingQuizHistories.documents.forEach(async (quizHistory) => {
        await databases.deleteDocument(dbId, "quizHistory", quizHistory.$id);
      });

      const usersThatFavoritedTheQuiz = await databases.listDocuments(
        dbId,
        "users",
        [Query.contains("favoritedQuizIds", quiz.$id)]
      );

      usersThatFavoritedTheQuiz.documents.forEach(async (user) => {
        const updatedFavoritedQuizIdsList = user.favoritedQuizIds.filter(
          (id: string) => id !== quiz.$id
        );
        await databases.updateDocument(dbId, "users", user.$id, {
          favoritedQuizIds: updatedFavoritedQuizIdsList,
        });
      });

      const correspondingQuestions = await databases.listDocuments(
        dbId,
        "questions",
        [Query.equal("quizId", quiz.$id)]
      );

      correspondingQuestions.documents.forEach(async (question) => {
        const imageFileId = question.imageUrl
          .split("/files/")[1]
          .split("/view")[0];
        await storage.deleteFile("images", imageFileId);
        await databases.deleteDocument(dbId, "questions", question.$id);
      });

      const previewImageFileId = quiz.previewUrl
        .split("/files/")[1]
        .split("/view")[0];
      await storage.deleteFile("images", previewImageFileId);

      await databases.deleteDocument(dbId, "quizzes", quiz.$id);
      window.location.reload();
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    }
  };

  if (loadingAuth) {
    return (
      <div className={styles.accountRoot}>
        <h1 className={styles.title}>Account</h1>
        <p className={styles.subtitle}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.accountRoot}>
      {user && displayUser && (
        <>
          <div className={styles.header}>
            <h1>{displayUser.username}'s Profile </h1>

            <div className={styles.headerButtons}>
              {user.admin && user.$id != displayUser.$id && (
                <Button
                  className={styles.deleteUserButton}
                  onClick={() => setDeleteUserId(displayUser.$id)}
                >
                  <Trash2 size={16}/>
                  Delete User
                </Button>
              )}

              {user && displayUser.$id !== user.$id && (
                <div>
                  {isFriend ? (
                    <Button onClick={() => removeFriend(displayUser.$id)}>
                      Unfriend
                    </Button>
                  ) : (
                    <Button onClick={() => addFriend(displayUser.$id)}>
                      Add Friend
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Points progress */}
          <div className={styles.experienceContainer}>
            <h2>Experience</h2>
            <div className={styles.progressContainer}>
              <p>
                Level {Math.floor(displayUser.points / 100)} -{" "}
                {displayUser.points % 100}/100 Points
              </p>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${displayUser.points % 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className={styles.accountTabLayout}>
            <button
              className={`${styles.tabButton} ${
                activeTab === "createdQuizzes" ? styles.selected : ""
              }`}
              onClick={() => setActiveTab("createdQuizzes")}
            >
              Created Quizzes
            </button>
            {user.admin && user.$id == displayUser.$id && (
              <button
                className={`${styles.tabButton} ${
                  activeTab === "users" ? styles.selected : ""
                }`}
                onClick={() => setActiveTab("users")}
              >
                Manage Users
              </button>
            )}
          </div>

          {activeTab === "createdQuizzes" && (
            <div className={styles.quizContainer}>
              {createdQuizzes?.length != 0 && createdQuizzes != null ? (
                <QuizListViewer
                  key={loadingUser}
                  title="Created Quizzes"
                  query={[
                    Query.contains("creatorUsername", [displayUser.username]),
                  ]}
                />
              ) : (
                <div>
                  {user.$id === displayUser.$id ? (
                    <div>
                      <h3 className={styles.emptyListMessage}>
                        You have no created quizzes.
                      </h3>
                      <NavLink to="/create">
                        <button className={styles.navigateElsewhereButton}>
                          Create your first quiz!
                        </button>
                      </NavLink>
                    </div>
                  ) : (
                    <h3 className={styles.emptyListMessage}>
                      This user has not created any quizzes.
                    </h3>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && user.admin && user.$id === displayUser.$id && userList &&(
          <div>
            <div className={styles.searchBarContainer}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search users..."
                value={userSearchInput}
                onChange={(e) => {setOffset(0); setUserSearchInput(e.target.value)}}
              />
              <div className={styles.paginationButtons}>
                <button
                  onClick={() => setOffset((prev) => Math.max(0, prev - 10))}
                  className={styles.pageArrow}
                  disabled={offset <= 0}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="#FFFFFF"
                  >
                    <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
                  </svg>
                </button>
                <button
                  onClick={() => setOffset((prev) => prev + 10)}
                  className={styles.pageArrow}
                  disabled={!userList || userList.length < 10}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="#FFFFFF"
                  >
                    <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className={styles.usersContainer}>
              {userList.map((userData, index) => (
                <div key={index} className={styles.userCard}>
                  <div className={styles.userInfo}>
                    <img
                      src={userData?.profilePictureId ? getImgUrl(userData.profilePictureId) : "/guest.png"}
                      alt={`Profile for ${userData?.username}`}
                      className={styles.profileImage}
                    />
                    <NavLink
                      to="/account"
                      state={`${userData.username}`}
                      className={styles.linkStyle}
                    >
                      <h3>{userData.username}</h3>
                    </NavLink>
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteUserId(userData.$id);
                    }}
                  >
                    <Trash2 id="deleteIcon" stroke="Red" size={22} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          )}

          {user && user.$id === displayUser.$id && (
            <div className={styles.userControls}>
              <Button className={styles.logoutButton} onClick={logout}>
                Sign Out
              </Button>
            </div>
          )}
        </>
      )}
      {!user && (
        <>
          <p className={styles.subtitle}>Sign in to access all features.</p>
          <AuthCard />
        </>
      )}

      {deleteUserId && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2 className={styles.popupTitle}>Delete Confirmation</h2>
            {deleteInProg ? (
            <p className={styles.popupMessage}>Deleting user in progress...</p>
            ) : (
            <>
              <p className={styles.popupMessage}>
                Are you sure you want to delete this user?
              </p>
              <div className={styles.popupActions}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteUserId(null);
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    deleteUser(deleteUserId);
                  }}
                  className={styles.confirmButton}
                >
                  Yes
                </button>
              </div>
            </>)}
          </div>
        </div>
      )}
    </div>
  );
}
