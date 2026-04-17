import ProtectedRoute from "@/components/protected-route";

export default function AdminDashboardPage() {
    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">

                <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">

                    <span className="text-5xl">🛡️</span>

                    <h1 className="mt-4 text-2xl font-bold text-gray-800">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-gray-500 text-sm">
                        You are authenticated. Admin features will be built here in Phase 2.
                    </p>

                    <div className="mt-6 inline-block bg-green-100 text-green-700 text-xs font-semibold px-4 py-2 rounded-full">
                        ✓ Access Granted
                    </div>

                </div>

            </main>
        </ProtectedRoute>
    );
}