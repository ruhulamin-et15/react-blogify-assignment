import { useEffect } from "react";
import { actions } from "../actions";
import CircleLoader from "../components/loader/CircleLoader";
import MyBlogs from "../components/profile/MyBlogs";
import ProfileInfo from "../components/profile/ProfileInfo";
import { useAuth } from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import useProfile from "../hooks/useProfile";
import useTitle from "../hooks/useTitle";

const Profile = () => {
  const { auth } = useAuth();
  useTitle(
    `${auth?.user?.firstName} ${auth?.user?.lastName} | Learn with Sumit`
  );
  const { api } = useAxios();
  const { state, dispatch } = useProfile();

  useEffect(() => {
    dispatch({ type: actions.profile.DATA_FETCHING }); //loading state
    const fetchProfile = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_BASE_URL}/profile/${auth?.user?.id}`
        );

        if (response.status === 200) {
          dispatch({ type: actions.profile.DATA_FETCHED, data: response.data }); //setUser and setPosts state
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: actions.profile.DATA_FETCH_ERROR,
          error: error.message,
        });
      }
    };
    fetchProfile();
  }, []);

  if (state.loading) {
    return <CircleLoader />;
  }

  return (
    <main className="mx-auto max-w-[1020px] py-8 min-h-screen">
      <div className="container">
        <ProfileInfo />
        <h4 className="mt-6 text-xl lg:mt-8 lg:text-2xl">Blogs</h4>
        <MyBlogs />
      </div>
    </main>
  );
};

export default Profile;
