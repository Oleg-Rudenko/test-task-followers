import { useState, useEffect } from 'react';
import { fetchUsers, nextPageUsers } from './api/usersAPI';
import css from './UserList.module.css';
import axios from 'axios';

export const UserList = () => {
  const userFollowers = () => {
    return JSON.parse(window.localStorage.getItem('userFollowers')) ?? {};
  };

  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(2);

  const [usersFollowingIds, setUserFollowingIds] = useState(userFollowers());

  useEffect(() => {
    window.localStorage.setItem(
      'userFollowers',
      JSON.stringify(usersFollowingIds)
    );
  }, [usersFollowingIds]);

  const fetchNextPage = async () => {
    setPage(prevPage => prevPage + 1);
    const usersNext = await nextPageUsers(page, 3);
    setUsers(prevUser => [...prevUser, ...usersNext]);
    if (page === 4) {
      return;
    }

    return usersNext;
  };

  useEffect(() => {
    (async () => {
      const user = await fetchUsers();
      setUsers(user);
    })();
  }, []);

  const following = (id, followingStatus) => {
    setUserFollowingIds(prevState => {
      const newState = { ...prevState };

      if (followingStatus) {
        delete newState[id];
      } else {
        newState[id] = true;
      }

      return newState;
    });

    setUsers(prevState => {
      return prevState.map(user => {
        if (user.id === id) {
          const newFollowers = followingStatus
            ? user.followers - 1
            : user.followers + 1;

          axios
            .put(`users/${id}`, { followers: newFollowers })
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.error(error);
            });
          return {
            ...user,
            followers: newFollowers,
          };
        }

        return user;
      });
    });
  };

  return (
    <div className={css.mainContainer}>
      {users && (
        <ul className={css.list}>
          {users.map(user => {
            const followingStatus = usersFollowingIds[user.id];

            return (
              <li key={user.id} className={css.containerItem}>
                <div className={css.space}>
                  <button type="button" className={css.imageLogo}></button>
                  <div className={css.upperPart}></div>
                  <div className={css.middleLine}>
                    <img
                      className={css.userFoto}
                      src={user.avatar}
                      alt={user.name}
                    ></img>
                  </div>
                  <div className={css.lowerPart}>
                    <p className={css.ps}> {user.tweets} Tweets</p>

                    <p className={css.ps}>
                      {' '}
                      {user.followers.toLocaleString('en-US')}
                      Followers
                    </p>

                    <button
                      id={user.id}
                      className={followingStatus ? css.btnPress : css.btnFollow}
                      type="button"
                      onClick={() => following(user.id, followingStatus)}
                    >
                      {followingStatus ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {users && page <= 4 && (
        <button type="button" onClick={fetchNextPage} className={css.btnLoad}>
          Next
        </button>
      )}
    </div>
  );
};
    