import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usersData from "../database/stubUsers";
import styles from "./Layout.module.css";

let currentHoverIndex = 0;

export default function Layout() {
  const [breakPoint, setBreakPoint] = React.useState(9999);
  const [currentHover, _setCurrentHover] = React.useState<
    | {
        top: string;
        height: string;
      }
    | undefined
  >(undefined);
  const { user } = useAuth();

  const setCurrentHover = (top: number) => {
    if (top < 0) return _setCurrentHover(undefined);
    currentHoverIndex++;
    _setCurrentHover((prev) => {
      if (prev) {
        console.log(currentHoverIndex);
        const i = currentHoverIndex;
        setTimeout(() => {
          if (i !== currentHoverIndex) return;
          _setCurrentHover((prev) => {
            if (prev) return { top: `${top * 56 + 4}px`, height: "48px" };
            return prev;
          });
        }, 100);
        return { top: `${top * 56 + 4}px`, height: "32px" };
      } else {
        return { top: `${top * 56 + 4}px`, height: "48px" };
      }
    });
  };

  useEffect(() => {
    const updateBreakPoint = () => {
      if (window.innerWidth <= 700) {
        setBreakPoint(700);
      } else if (window.innerWidth <= 1450) {
        setBreakPoint(1450);
      } else if (window.innerWidth <= 1600) {
        setBreakPoint(1600);
      } else {
        setBreakPoint(9999);
      }
    };

    window.addEventListener("resize", updateBreakPoint);
    updateBreakPoint();

    return () => {
      window.removeEventListener("resize", updateBreakPoint);
    };
  }, []);

  return (
    <div className={styles.layoutRoot}>
      <div className={styles.mainNav}>
        {breakPoint > 700 && (
          <img
            src={breakPoint <= 1600 ? "/logoSmall.svg" : "/logo.svg"}
            alt="logo"
            className={styles.logoImage}
          />
        )}
        <div
          className={styles.mainNavLinks}
          onMouseLeave={() => setCurrentHover(-1)}
        >
          {currentHover && breakPoint > 700 && (
            <div
              className={styles.linkBackgroundHighlight}
              style={{
                top: currentHover.top,
                height: currentHover.height,
              }}
            ></div>
          )}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            onMouseEnter={() => setCurrentHover(0)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              className={styles.navLinkIcon}
            >
              <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
            </svg>
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            onMouseEnter={() => setCurrentHover(1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              className={styles.navLinkIcon}
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
            <span>Search</span>
          </NavLink>
          {/* <Link to="/contest" className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }>
          Contest
        </Link> */}{" "}
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            onMouseEnter={() => setCurrentHover(2)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              className={styles.navLinkIcon}
            >
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
            <span>Create</span>
          </NavLink>
          <NavLink
            to="/library"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            onMouseEnter={() => setCurrentHover(3)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              className={styles.navLinkIcon}
            >
              <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z" />
            </svg>
            <span>Library</span>
          </NavLink>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            onMouseEnter={() => setCurrentHover(4)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              className={styles.navLinkIcon}
            >
              <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
            </svg>
            <span>Account</span>
          </NavLink>
        </div>
      </div>
      <div className={styles.mainCont}>
        {breakPoint <= 700 && (
          <img
            src={"/logo.svg"}
            alt="logo"
            className={styles.mobileLogoImage}
          />
        )}
        <Outlet />
      </div>
      {breakPoint > 1450 && (
        <div className={styles.sideNav}>
          <div key={usersData[0].id} className={styles.userContainer}>
            <img
              src={user?.photoURL ? user.photoURL : "/guest.png"}
              alt={`Profile for ${user?.displayName}`}
              className={styles.userContainerImage}
            />
            <div className={styles.userContainerRight}>
              {/* <p>Rank: {usersData[0].ranking}</p> */}
              <h3>{user ? user.username : "Guest"}</h3>
              <p>{user ? "Level " + Math.floor(user.points / 100) : ""}</p>
            </div>
          </div>
          <div>
            <h2>Leaderboard</h2>
            <div className={styles.ranksContainer}>
              {usersData.map((user) => (
                <div key={user.id} className={styles.userContainer}>
                  <img
                    src={user.image}
                    alt={`Profile for ${user.name}`}
                    className={styles.userContainerImage}
                  />
                  <div className={styles.userContainerRight}>
                    <p>Rank: {user.ranking}</p>
                    <h3>{user.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
