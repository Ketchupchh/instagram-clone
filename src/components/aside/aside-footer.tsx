import Link from "next/link";

const footerLinks = [
  ['About', 'https://about.instagram.com'],
  ['Help', 'https://help.instagram.com'],
  ['Press', 'https://about.instagram.com/blog/'],
  ['API', 'https://developers.facebook.com/docs/instagram'],
  ['Jobs', 'https://about.instagram.com/about-us/careers'],
  ['Privacy', 'https://privacycenter.instagram.com/policy/?entry_point=ig_help_center_data_policy_redirect'],
  ['Terms', 'https://help.instagram.com/581066165581870/'],
  ['Locations', 'https://www.instagram.com/explore/locations/'],
  ['Language', '#'],
  ['Meta Verified', 'https://about.meta.com/technologies/meta-verified/']
] as const;

export function AsideFooter() : JSX.Element
{
    return (
        <footer className="flex flex-col gap-y-5 w-full text-light-secondary">
            <nav className="flex gap-x-2 text-[12px] flex-wrap">
                {footerLinks.map(([linkName, href], index) => (
                    <Link
                        className="hover:underline"
                        key={index}
                        href={href}
                        rel="noreferrer"
                        target="_blank"
                    >
                        {linkName}
                    </Link>
                ))}
            </nav>
            
            <p className="text-[12px]">© 2023 INSTAGRAM FROM META</p>
        </footer>
    );
}