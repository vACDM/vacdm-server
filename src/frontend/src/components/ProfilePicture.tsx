import User from '../../../shared/interfaces/user.interface';

export interface IProfilePictureProps {
  user: User | undefined;
  className?: string | void;
  size?: number | void;
}

export default function ProfilePicture({ user, className = 'rounded-full border-2', size = 64 }: IProfilePictureProps) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={`${size}px`}
    height={`${size}px`}
    viewBox={`0 0 ${size} ${size}`}
    version="1.1"
    className={className || ''}>
        <rect
          fill="#18181B"
          cx={size / 2}
          width={size}
          height={size}
          cy={size / 2}
          r={size / 2}
        />
        <text
          x="50%"
          y="50%"
          style={{ color: '#FFF', lineHeight: 1, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif" }}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontSize={size / 2.3}
          fontWeight="400"
          dy=".1em"
          dominantBaseline="middle"
          fill="#FFFFFF"
        >{user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : '?'}</text>
    </svg>;
}
