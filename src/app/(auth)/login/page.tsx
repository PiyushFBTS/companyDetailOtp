
import OtpLogin from "@/components/OtpLogin";


function LoginPage() {
    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
                    Login with OTP
                </h1>
                <OtpLogin />
            </div>
        </div>
    );
}

export default LoginPage;
