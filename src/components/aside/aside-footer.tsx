import Link from "next/link";

const footerLinks = [
  ['About', 'https://twitter.com/tos'],
  ['Help', 'https://twitter.com/privacy'],
  ['Press', 'https://support.twitter.com/articles/20170514'],
  ['API', 'https://help.twitter.com/resources/accessibility'],
  ['Jobs', '/'],
  ['Privacy', '/'],
  ['Terms', '/'],
  ['Locations', '/'],
  ['Language', '/'],
  ['Meta Verified', '/']
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