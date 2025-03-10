import { useEffect } from 'react';
import backend from '../components/backend';

function VerifyEmail () {
    useEffect(() => {
        backend.get('');
    }, []);

    return (
        <div>
            IN PROGRESS...
        </div>
    );
};

export default VerifyEmail;