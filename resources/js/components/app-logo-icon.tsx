import logo from '@/assets/IntelliDash-logo.png';
import type { ImgHTMLAttributes } from 'react';

type ApplicationLogoProps = ImgHTMLAttributes<HTMLImageElement>;

export default function ApplicationLogo(props: ApplicationLogoProps) {
    return (
        <img
            src={logo}
            alt="IntelliDash AI ERP"
            className="h-10 w-auto"
            {...props}
        />
    );
}