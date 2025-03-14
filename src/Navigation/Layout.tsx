import React, { useEffect } from "react";
import styles from "./Layout.module.css";
import { Outlet, Link, NavLink } from "react-router-dom";
import usersData from "../database/stubUsers";

export default function Layout() {
  const [breakPoint, setBreakPoint] = React.useState(9999);

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
            src={breakPoint <= 1600 ? "/LogoSmall.jpg" : "/Logo.png"}
            alt="logo"
            className={styles.logoImage}
          />
        )}
        <div className={styles.mainNavLinks}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <img
              src="/home.png"
              alt="Home icon"
              className={styles.navLinkIcon}
            />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <img
              src="/search.png"
              alt="Search icon"
              className={styles.navLinkIcon}
            />
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
          >
            <img
              src="/create.png"
              alt="Create icon"
              className={styles.navLinkIcon}
            />
            <span>Create</span>
          </NavLink>
          <NavLink
            to="/library"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <img
              src="/library.png"
              alt="Library icon"
              className={styles.navLinkIcon}
            />
            <span>Library</span>
          </NavLink>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <img
              src="/account.png"
              alt="Account icon"
              className={styles.navLinkIcon}
            />
            <span>Account</span>
          </NavLink>
        </div>
      </div>
      <div className={styles.mainCont}>
        <Outlet />
      </div>
      {breakPoint > 1450 && (
        <div className={styles.sideNav}>
          <div key={usersData[0].id} className={styles.userContainer}>
            <img
              src={usersData[0].image}
              alt={`Profile for ${usersData[0].name}`}
              className={styles.userContainerImage}
            />
            <div className={styles.userContainerRight}>
              {/* <p>Rank: {usersData[0].ranking}</p> */}
              <h3>{usersData[0].name}</h3>
              <p>{usersData[0].email}</p>
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
