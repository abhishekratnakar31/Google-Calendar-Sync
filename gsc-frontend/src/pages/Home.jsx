function Home() {
  return (
    <div className="text-white h-screen flex justify-center items-center bg-gray-900">
      <a 
        href="http://localhost:8000/auth/init"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-lg"
      >
        Login with Google
      </a>
    </div>
  );
}

export default Home;
