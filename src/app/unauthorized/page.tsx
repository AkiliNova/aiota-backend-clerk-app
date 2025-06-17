export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold">🚫 Unauthorized</h1>
      <p className="mt-4 text-gray-600">You dont have permission to access this page.</p>
    </div>
  );
}
