export default function LoadingScreen() {

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white rounded-2xl shadow-lg px-10 py-8">

        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

        <p className="text-gray-600 font-medium">
          Loading...
        </p>

      </div>

    </div>

  );

}