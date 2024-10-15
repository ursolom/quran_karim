import { FaFacebook, FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { Link } from "react-router-dom";

export default function Profiler() {
  const about_site = [
    { article: "1 - كل مسلم" },
    { article: "2 - كل رجل وامرأة وطفل فلسطيني فك الله كربهم" },
    {
      article:
        "أهدي هذا الموقع إليك أخي المؤمن وأتمنى من الله أن يتقبله خالصًا لوجهه، متى ما قرأت لا تنسانا والمسلمين من دعواتك، كتب الله لكم البُشر والفرح.",
    },
  ];

  const socialLinks = [
    {
      href: "https://www.facebook.com/sliman.ramadan.73",
      icon: FaFacebook,
      bgClass: "bg-white text-blue-700",
    },
    {
      href: "https://wa.me/01021490920?text=Hi",
      icon: FaWhatsapp,
      bgClass: "bg-[#25d366] text-white",
    },
    {
      href: "https://www.facebook.com/messages/t/sliman.ramadan.73",
      icon: FaFacebookMessenger,
      bgClass:
        "bg-gradient-to-bl from-[#FF6968] via-violet-600 to-blue-500 text-white",
    },
  ];

  return (
    <>
      <div className="border-[5px] w-full h-full rounded-lg">
        <Link
          to="/"
          className="absolute top-5 left-5 z-40 p-2 rounded-xl text-white bg-neutral-900 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100"
        >
          <TiArrowBack />
        </Link>
        <div
          className="bg-green-400 col-span-1 p-4 flex flex-col gap-2 relative md:rounded-l-xl shadow-lg"
          dir="rtl"
        >
          <p className="my-5">
            ما رأيت أشرف ولا أعز ولا أغلى منك، كتاب الله، وهذا أقل ما أقدمه
            ابتغاء وجه الله وابتغاء إعلاء كلماته، تبارك ربي.
          </p>
          <p className="text-center">أهدي هذا الموقع إلى كل من:</p>
          <div className="flex flex-col gap-5">
            {about_site.map((item, index) => (
              <p key={index}>{item.article}</p>
            ))}
          </div>
          <span className="relative w-full h-1 my-5 rounded-lg bg-black"></span>
          <p className="text-center mt-5">للتواصل مع المطور</p>
          <div className="flex justify-center items-center text-[25px] bg-white rounded-md flex-col gap-2 mt-4 py-7 relative">
            <p className="bg-gradient-to-t from-green-500 to-cyan-400 my-3 bg-clip-text text-transparent">
              سليمان رمضان خلف
            </p>
            <div className="flex gap-5 justify-center items-center">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`${link.bgClass} rounded-lg p-1 text-center hover:rounded-3xl hover:scale-150 transition-all shadow-lg hover:shadow-none hover:rotate-12 duration-300`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <link.icon />
                </a>
              ))}
            </div>
          </div>
          <div className="text-center my-5">دمتم بخير وتقبل الله مـنــا ومـنــكــم</div>
        </div>
      </div>
    </>
  );
}
