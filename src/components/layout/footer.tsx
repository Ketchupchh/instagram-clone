import Link from "next/link";

const footerLinks = [
    ['Meta', 'https://twitter.com/tos'],
    ['About', 'https://twitter.com/privacy'],
    ['Blog', 'https://support.twitter.com/articles/20170514'],
    ['Jobs', 'https://help.twitter.com/resources/accessibility'],
    ['Help', '/'],
    ['API', '/'],
    ['Privacy', '/'],
    ['Terms', '/'],
    ['Top Accounts', '/'],
    ['Locations', '/'],
    ['Instagram Lite', '/'],
    ['Contact Uploading & Non-Users', '/'],
    ['Meta Verified', '/'],
] as const;

export function Footer() : JSX.Element
{
    return (
        <>
            <div className="px-5 flex flex-row w-full justify-between text-neutral-600 text-[12px] mb-2 break-words flex-wrap">
                {footerLinks.map(([linkName, link], index) => (
                    <div key={index}>
                        <Link className="hover:underline" href={link}>{linkName}</Link>
                    </div>
                ))}
            </div>

            <p className="w-full text-center text-neutral-600 text-[12px]">© 2023 Instagram from Meta</p>
        </>
    );
}