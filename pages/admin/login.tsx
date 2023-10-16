import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Label, Input, Button, WindmillContext } from '@roketid/windmill-react-ui'
import API from '../../app/API'
import Loading from '../../components/loading'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/router'

interface IUser {
  username: string,
  password: string
}

function LoginPage() {
  const router = useRouter()
  useEffect(() => {
    const check = () => {
      API.get(`auth/check`).then((e) => {
        window.location.replace("/admin");
      }).catch(e => { });
    };

    return check();
  }, []);
  const { mode } = useContext(WindmillContext)

  const [imgSource, setImgSource] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {

    setImgSource(mode === 'dark' ? '/assets/img/login-office-dark.jpeg' : '/assets/img/login-office.jpeg')
  }, [mode])

  const [user, setUser] = useState<IUser>({ username: "", password: "" })

  const login = (e: any) => {
    e.preventDefault();

    setIsLoading(true)
    API.post("/auth/login", user).then(res => {
      localStorage.setItem("token", res.data.access_token)
      setIsLoading(false)
      console.log(res);
      router.push("/admin")
    }).catch(e => {
      setIsLoading(false)
      setError(true)
    })
  }


  return (
    <div className='flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900'>
      <div className='flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800'>
        <div className='flex flex-col overflow-y-auto md:flex-row'>
          <div className='relative h-32 md:h-auto md:w-1/2'>
            <Image
              aria-hidden='true'
              className='hidden md:block object-cover w-full h-full'
              src={imgSource}
              alt='Office'
              layout='fill'
            />
          </div>
          <main className='flex items-center justify-center p-6 sm:p-12 md:w-1/2'>
            <div className='w-full'>

              <h1 className='mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200'>
                Login
              </h1>
              <p className={'text-red-500 text-sm mb-4 ' + (!error ? ' hidden' : '')}>Incorrect username/password</p>
              <form
                action={"#"}
                onSubmit={login}>
                <Label>
                  <span>Username</span>
                  <Input
                    formAction={() => {
                      console.log("submit")
                    }}
                    crossOrigin={false}
                    formMethod=''
                    className='mt-1'
                    type='text'
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder='john@doe.com'

                  />
                </Label>

                <Label className='mt-4'>
                  <span>Password</span>
                  <Input
                    crossOrigin={false}
                    className='mt-1'
                    type='password'
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder='***************'
                  />
                </Label>

                <Button className='mt-4' type='submit' block  >
                  Log in
                </Button>
                <hr className='my-8' />

              </form>
            </div>
          </main>
        </div>
      </div >

      {isLoading && (<Loading />)
      }
    </div >
  );
}

export default LoginPage
