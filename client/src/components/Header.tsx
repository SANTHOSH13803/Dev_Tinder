import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../store/api/user/userApi.slice";
import { toast } from "react-toastify";
import { removeUser } from "../store/slice/user";
import { useAppDispatch, useAppSelector } from "../store/hook";
import commonApiSlice from "../store/api/main/user.api";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [logoutApi] = useLogoutMutation();
  const handleLogout = async () => {
    const response = await logoutApi();
    if (response.data) {
      dispatch(removeUser());
      navigate("/login");
      setTimeout(() => {
        dispatch(commonApiSlice.util.resetApiState());
      }, 0);
      return;
    }
    toast.error("Something went wrong");
  };
  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to="/">
          DevTinder
        </Link>
      </div>
      <div className="flex gap-2">
        <div className="dropdown dropdown-end mx-5">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src={
                  user?.photoURL ??
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-10"
          >
            <li>
              <Link className="justify-between" to={"/profile"}>
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
