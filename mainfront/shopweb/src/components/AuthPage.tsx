import { useForm, Resolver } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type FormValues = {
  email: string;
  password: string;
  domain: string;
};
const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.email ? values : {},
    errors: !values.email
      ? {
          email: {
            type: 'required',
            message: 'email is required',
          },
          password: {
            type: 'required',
            message: 'password is required ',
          },
          domain: {
            type: 'required',
            message: 'domain is required',
          },
        }
      : {},
  };
};
const AuthPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });
  const onSubmit = handleSubmit((data) => navigate(`/${data.email.split('@')[0]}`));
  return (
    <div className='flex flex-col items-center  justify-center h-[100vh] '>
      <form
        onSubmit={onSubmit}
        className='flex text-white flex-col items-center w-[80vw] md:w-[50vw] lg:w-[25vw] justify-center  gap-4 border-2 border-white p-10 rounded-lg'
      >
        <img src='/logo.png' className='w-40' alt='' />
        <div className='flex flex-col w-[80%]'>
          <label htmlFor=''> Email</label>
          <input className='border p-4 rounded-lg text-black ' {...register('email')} placeholder='mail@example.com' />
          {errors?.email && <p className='text-red-500'>{errors.email.message}</p>}
        </div>
        <div className='flex flex-col w-[80%]'>
          <label htmlFor=''> Password</label>
          <input
            className='border p-4 rounded-lg text-black'
            {...register('password')}
            type='password'
            placeholder='Password'
          />
          {errors?.password && <p className='text-red-500'>{errors.password.message}</p>}
        </div>
        <div className='flex flex-col w-[80%]'>
          <label htmlFor=''> Domain</label>

          <input className='border p-4 rounded-lg  text-black' {...register('domain')} placeholder='Your Domain' />
          {errors?.domain && <p className='text-red-500'>{errors.domain.message}</p>}
        </div>
        <input type='submit' className='cursor-pointer border p-4 rounded-lg text-white' />
      </form>
    </div>
  );
};

export default AuthPage;
