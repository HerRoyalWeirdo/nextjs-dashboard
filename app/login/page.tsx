import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';

export default function Loginpage() {
//lesson 15 author vs authen
return (
    <main className="flex items-center justify-center md:h-screen">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
            <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
                <div className="w-32 text-white md:w-36">
                    <AcmeLogo />
                </div>
            </div>
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    </main>
);

}
//https://stackoverflow.com/questions/75000633/where-to-generate-next-auth-secret-for-next-auth
//https://generate-secret.vercel.app/32
//640071179699d5074eed2a860c1a414a