'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [ghURL, setGhURL] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fullPath = window.location.pathname;
    const rl = fullPath.replace(/^\/+/, ''); // remove leading slash

    if (!rl) {
      setError(true);
      return;
    }

    const fetchAndRedirect = async () => {
      try {
        const res = await fetch(`https://repolink.pythonanywhere.com/get_link?rl_url=${rl}`);
        const data = await res.json();

        if (typeof data === 'string' && data.startsWith('http')) {
          setGhURL(data);
          window.location.href = data;
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Redirect failed:', err);
        setError(true);
      }
    };

    fetchAndRedirect();
  }, []);

  const handleClickGoBack = async () => {
    router.push('/');
  };

  return (
    <div className="content">
        {error &&
          <div>
          <p className="error bigger-text">The <span className="gradtext">repol.ink</span> is not valid.</p>
          <button className="button2" onClick={handleClickGoBack}>Go Home</button>
          </div>
        }
        {!error && ghURL &&
          <div className="preview bigger-text">
          <p>Redirecting you to <a href={ghURL} target="_blank" rel="noopener noreferrer"><span className="gradtext">{ghURL}</span></a>...</p>
          </div>
        }
        {!error && !ghURL &&
          <div className="preview bigger-text">
          <p>Looking up GitHub repo...</p>
          </div>
        }
    </div>
  );
};

export default Page;
