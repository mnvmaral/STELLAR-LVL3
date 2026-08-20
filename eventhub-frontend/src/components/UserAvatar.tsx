interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar = ({ name, avatar, size = 'md' }: UserAvatarProps) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-2xl',
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold`}>
      {initials}
    </div>
  );
};
