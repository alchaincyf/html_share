import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            元宝伴侣 - HTML分享预览工具
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            轻松粘贴HTML代码实现预览，并分享给朋友，完全像是一个独立的网站，可以交互操作。
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/create"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              创建新项目
            </Link>
            <Link href="/projects" className="text-sm font-semibold leading-6 text-gray-900">
              查看我的项目 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">更简单、更高效</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              功能特点
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              元宝伴侣提供了一系列强大的功能，帮助您轻松创建、预览和分享HTML项目。
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  实时预览
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    实时查看您的HTML代码效果，支持JavaScript交互，使开发更加高效。
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  一键分享
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    生成唯一的分享链接，轻松与他人分享您的HTML项目，无需任何部署步骤。
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  项目管理
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    保存并管理您的HTML项目，随时可以编辑和更新，方便进行版本管理。
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
