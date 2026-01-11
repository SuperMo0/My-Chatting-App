import React, { useState } from 'react'
import { useAuthStore } from '../stores/auth.store.js';
import { ClipLoader } from 'react-spinners';
import { NavLink } from 'react-router';

export default function Signup() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signup, isSigningUp } = useAuthStore();

    function handleFormSubmit(e) {
        e.preventDefault();
        signup({ email, password, name });
    }

    return (
        <>
            <div className='text-center mt-5' >
                <h1 className='text-8xl text-blue font-extrabold'>Chat</h1>
                <p className='text-3xl text-base-content/70'>Connect freely</p>
            </div>
            <form action={'/'} onSubmit={handleFormSubmit} className='h-screen grid justify-center items-baseline' >
                {isSigningUp && <div className='grid place-content-center h-full'>
                    <ClipLoader color='blue' loading={true} />
                </div>}
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend">Signup</legend>
                    <label className="label">Name</label>
                    <input required value={name} onChange={(e) => { setName(e.target.value) }} type="text" className="input" placeholder="your name" autoComplete='name' name='name' />
                    <label className="label">Email</label>
                    <input required value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" className="input" placeholder="Email" autoComplete='username' name='email' />
                    <label className="label">Password</label>
                    <input required value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" className="input" placeholder="Password" autoComplete='current-password' name='password' />
                    <button disabled={isSigningUp} type='submit' className="btn btn-neutral mt-4">Signup</button>
                    <p className='text-base'> already have account? <NavLink className={"hover:text-blue"} to={'/login'}>login</NavLink> </p>

                </fieldset>
            </form>
        </>
    )
}
