import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper.js'
import AuthLayout from '../../components/layouts/AuthLayout.jsx'
import Input from '../../components/Inputs/Input.jsx'
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector.jsx"
import { API_PATHS } from '../../utils/apiPaths.js'
import { UserContext } from "../../context/userContext.jsx";
import  uploadImage from '../../utils/uploadImage.js'
import axiosInstance from '../../utils/axiosInstance.js'


const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext); // Get updateUser function from context
  const navigate = useNavigate();
  // Handle Signup Form Submit 
  const handleSignUp = async (e) => {
      e.preventDefault();

      let profileImageUrl = '';
      if (!fullName){
        setError("Please enter full name");
        return;
      }

      if (!validateEmail(email)){
        setError("Please enter a valid email address");
        return;
      }


      if (!password ){
        setError("Please enter the password");
        return;
      }

      setError("");

      // SignUp API Call
      try {

        // Upload image if present
        if (profilePic) {
          const imgUploadRes = await uploadImage(profilePic);
          profileImageUrl = imgUploadRes.imageUrl || "";
        }
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
          name: fullName,
          email,
          password,
          profileImageUrl,
          adminInviteToken,
        });

        const { token, role } = response.data;
        if (token) {
          localStorage.setItem("token", token); // Store token in local storage
          updateUser(response.data); // Update user context
          // Redirect based on role
          if (role === "Admin") {
            navigate("/admin/dashboard");
          }
          else {
            navigate("/user/dashboard");
          }
        }
      }
      catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        }
        else {
          setError ("Something went wrong. Please try again")
        }
      }
  };
  

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image = {profilePic} setImage={setProfilePic} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

            <Input
              value={fullName}
              onChange={({target}) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
              autoComplete="name"
            />

            <Input
                  value={email}
                  onChange={({target}) => setEmail(target.value)}
                  label="Email Address"
                  placeholder="example@gmail.com"
                  type="text"
                  autoComplete="username"
            />
            <Input
                value={password}
                onChange={({target}) => setPassword(target.value)}
                label="Password"
                placeholder="Min 8 characters"
                type="password"
                autoComplete="current-password"
            />

            <Input
                value={ adminInviteToken}
                onChange={({target}) => setAdminInviteToken(target.value)}
                label="Admin Invite Token"
                placeholder="6 Digit Code"
                type="text"
            />
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5 mt-2'>{error}</p>}

          <button type="submit" className='btn-primary'>
            SIGNUP
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{""}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Signup