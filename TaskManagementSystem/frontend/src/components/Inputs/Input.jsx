import React, {useState} from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa'

const Input = ({value, onChange, label, placeholder, type, autoComplete}) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

  return (
    <div>
        <label className='text-[13px] font-medium text-slate-800 mb-2'>{label}</label>
        <div className='input-box'>
            <input
                type={
                    type == 'password' ? (showPassword ? 'text' : 'password'): type
                }
                placeholder={placeholder}
                className="w-full bg-transparent outline-none"
                value={value}
                onChange={(e) => onChange(e)} 
                autoComplete={autoComplete}               
            />

            {type == 'password' && (
                <>
                    {showPassword ? (
                        <FaRegEye
                            size={22}
                            className=""
                            onClick={()=>toggleShowPassword()}
                        />
                    ) : (
                        <FaRegEyeSlash
                            size={22}
                            className=""
                            onClick={()=>toggleShowPassword()}
                        />
                    )}
                </>
            )}
        </div>
    </div>
  );
};

export default Input;