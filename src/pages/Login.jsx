"use client"

const Login = () => {
    const handleLogin = () => {
        window.location.href = "http://127.0.0.1:5000/login";
    }

    return(
        <div className="bg-white">
            <div className='flex flex-col justify-center items-center h-screen text-black '>
            <h1 className='text-3xl font-bold'>Hello, Connect your spotify account!!</h1>
            <p className='text-2xl'>Don't worry we only read the data to provide you the playlist you want right now!!</p>
            <button
            onClick={handleLogin}
            className='p-4 rounded-xl bg-emerald-500 mt-12 hover:cursor-pointer  hover:bg-black hover:text-white transition-colors duration-600 text-black font-bold '
            >Connect Spotify</button>
            </div>
            

        </div>
    )
}

export default Login 