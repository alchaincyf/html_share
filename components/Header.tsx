'use client';

import Link from 'next/link';
import { Disclosure, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: '首页', href: '/', current: false },
  { name: '我的项目', href: '/projects', current: false },
  { name: '创建新项目', href: '/create', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // 确保代码只在客户端执行
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // 执行初始检查
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // 根据当前路径更新导航项的状态
  const currentNavigation = navigation.map(item => ({
    ...item,
    current: pathname === item.href
  }));

  return (
    <Disclosure as="nav" className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent backdrop-blur-sm'}`}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className={`relative inline-flex items-center justify-center rounded-md p-2 ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-indigo-600 hover:bg-indigo-50'} hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500`}>
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">打开主菜单</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/" className={`text-xl font-bold transition-colors duration-300 ${scrolled ? 'text-indigo-600' : 'text-indigo-500'} hover:text-indigo-700`}>
                    <span className="mr-1">AI</span>
                    <span className="text-indigo-800 font-extrabold">Page</span>
                    <span className="text-indigo-400">.top</span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {currentNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-indigo-100 text-indigo-700'
                            : `${scrolled ? 'text-gray-700' : 'text-gray-700'} hover:bg-indigo-50 hover:text-indigo-700`,
                          'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 hidden sm:flex items-center pr-2">
                <Link
                  href="/create"
                  className={`inline-flex items-center rounded-md px-3.5 py-1.5 text-sm font-medium ${scrolled ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'} shadow-sm transition-all duration-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                >
                  创建页面
                </Link>
              </div>
            </div>
          </div>

          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-150 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {currentNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
} 