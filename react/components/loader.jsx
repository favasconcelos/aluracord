import { RiLoader3Line } from 'react-icons/ri';
import cn from 'classnames';

export default function Loader({ className, ...props }) {
  return <RiLoader3Line className={cn('animate-spin', className)} {...props} />;
}
