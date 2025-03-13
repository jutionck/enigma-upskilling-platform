import {
  Link,
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  link as linkStyles,
  Button,
} from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { FaDiscord } from 'react-icons/fa';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import { useAuthStore } from '@/store/useAuthStore';
import { auth, signInWithPopup, provider, signOut } from '@/config/firebase';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  const handleGoogleSignIn = async () => {
    try {
      const result: any = await signInWithPopup(auth, provider);

      setUser({
        uid: result.user.uid,
        displayName: result.user.displayName || 'User',
        email: result.user.email || '',
        photoURL: result.user.photoURL || '',
        role: result.user.role,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <HeroUINavbar maxWidth='xl' position='sticky'>
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand className='gap-3 max-w-fit'>
          <Link
            className='flex justify-start items-center gap-1'
            color='foreground'
            href='/'
          >
            <p className='font-bold text-inherit'>Enigma Upskilling Platform</p>
          </Link>
        </NavbarBrand>
        <div className='hidden lg:flex gap-4 justify-start ml-2'>
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium'
                )}
                color='foreground'
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className='hidden sm:flex basis-1/5 sm:basis-full'
        justify='end'
      >
        <NavbarItem className='hidden sm:flex gap-2'>
          <Link isExternal href={siteConfig.links.discord} title='Discord'>
            <FaDiscord className='text-default-500 text-2xl' />
          </Link>
          <ThemeSwitch />

          {user ? (
            <div className='flex items-center gap-3'>
              <img
                alt='User Avatar'
                className='w-8 h-8 rounded-full'
                src={user.photoURL}
              />
              <Button color='danger' size='sm' onPress={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button color='primary' size='sm' onPress={handleGoogleSignIn}>
              Sign in with Google
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className='sm:hidden basis-1 pl-4' justify='end'>
        <Link isExternal href={siteConfig.links.discord}>
          <FaDiscord className='text-default-500 text-2xl' />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? 'primary'
                    : index === siteConfig.navMenuItems.length - 1
                      ? 'danger'
                      : 'foreground'
                }
                href={item.href}
                size='lg'
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}

          {user && (
            <NavbarMenuItem>
              <Button
                className='w-full'
                color='danger'
                size='lg'
                onPress={handleLogout}
              >
                Logout
              </Button>
            </NavbarMenuItem>
          )}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
