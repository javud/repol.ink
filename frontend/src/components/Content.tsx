'use client';
import React, { useState, useEffect } from 'react';

const Content = () => {
    const [ghURL, setghURL] = useState<string>('');
    const [rlURL, setrlURL] = useState<string>('');
    const [isValidGH, setIsValidGH] = useState<boolean>(false);
    const [isValidRL, setIsValidRL] = useState<boolean>(false);
    const [status, setStatus] = useState<number>(0); // 0 -> reset, 1 -> successful
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState('Copy')
    const [savedLinks, setSavedLinks] = useState<{ short: string, full: string }[]>([]);
    const [showSavedLinks, setShowSavedLinks] = useState<boolean>(false);

    useEffect(() => {
        const stored = localStorage.getItem('savedLinks');
        if (stored) {
            setSavedLinks(JSON.parse(stored));
        }
    }, [status]);

    const handleInputChangeGH = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value.toLowerCase();
        if (value.startsWith("github.com/")) {
            value = "https://" + value
        }
        if (value.startsWith("http://")) {
            value = value.replace("http://", "https://")
        }
        setghURL(value);
        const githubRepoRegex = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;
        const validity = githubRepoRegex.test(value)
        setIsValidGH(validity);
        setError('');
        console.log(validity);
    };

    const handleInputChangeRL = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim();
        setrlURL(value);
        let validity = false;
        if(value.length > 0) {
            validity = true;
        }
        setIsValidRL(validity)
        console.log(validity)
    };

    const handleClickCreate = async () => {
        if(rlURL.trim().length == 0) {
            return
        }
        const query = new URLSearchParams({ rl_url: rlURL, gh_url: ghURL });
        const response = await fetch(`https://repolink.pythonanywhere.com/create_link?${query}`);
        const result = await response.text();
        console.log(result);

        if (result === "Successful") {
            setError('')
            setStatus(1)
            console.log(`Your repol.ink was created successfully! repol.ink/${rlURL}`);
            // save to localStorage
            const existing = JSON.parse(localStorage.getItem('savedLinks') || '[]');
            const updated = [...existing, { short: rlURL, full: ghURL }];
            localStorage.setItem('savedLinks', JSON.stringify(updated));
        } else {
            setError(result) // backend error like “This repolink already exists”
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleClickCreate();
        }
    };

    const handleClickGoBack = async () => {
        setghURL('');
        setrlURL('');
        setIsValidGH(false);
        setIsValidRL(false);
        setStatus(0);
    };

    const handleClickCopy = async () => {
        await navigator.clipboard.writeText("repol.ink/" + rlURL)
        .then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess('Copy'), 2000); // clear message after 2s
        })
        .catch(err => {
            console.error('Failed to copy!', err);
        });
    };
    
    const renderForm = () => (
        <div className="content">
            <div className="big">Create custom links for your <span className="gradtext">GitHub repos</span></div>
            <div>
                <div className="inputContainer">
                    <label htmlFor="email">GITHUB REPO URL</label>
                    <input
                    className="inputBox"
                    type="text"
                    placeholder="Paste your GitHub repo link here..."
                    value={ghURL}
                    id="ghURL"
                    onChange={handleInputChangeGH}
                    autoComplete="off"
                    maxLength={200}
                    autoFocus
                    />
                </div>
            </div>
            {isValidGH && 
                <div>
                    <div className="inputContainer">
                        <label htmlFor="rlURL">CUSTOM REPOL.INK URL</label>
                        <input
                        className="inputBox"
                        type="text"
                        placeholder="Choose your repol.ink URL..."
                        value={rlURL}
                        id="rlURL"
                        onChange={handleInputChangeRL}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                        maxLength={200}
                        autoFocus
                        />
                        {isValidRL &&
                            <button className="button" onClick={handleClickCreate}>
                                Create
                            </button>
                        }
                    </div>
                    {error && <p className="error">{error}</p> }
                    {isValidGH && isValidRL && 
                        <>
                        <p>Preview:</p>
                        <p className="preview">repol.ink/{rlURL}</p>
                        </>
                    }
                </div>
            }
        </div>
    );

    const renderSuccess = () => (
        <div className="content">
            <div className="big">🥳 Success! Your repol.ink is:</div>
            <div className="container">
                <div className="repolink"><a href={"https://repol.ink/"+rlURL} target="_blank" rel="noopener noreferrer"><span className="gradtext">repol.ink/{rlURL}</span></a></div>
                <button className="button" onClick={handleClickCopy}>{copySuccess}</button>
            </div>
            <p className="gitURL">{ghURL}</p>
            <button className="button2" onClick={handleClickGoBack}>Go Back</button>
        </div>
    );

    // taking advantage of tailwind CSS
    const renderSavedLinks = () => (
        <div className="content">
            <>
            <button className="button" onClick={() => setShowSavedLinks(prev => !prev)}>
                {showSavedLinks ? 'Hide' : 'Show'} Your Links
            </button>

            <div
                className={`transition-all duration-500 overflow-hidden ${
                showSavedLinks ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="savedLinksContainer rounded-xl p-4 shadow-md">
                <ul className="space-y-4">
                    {savedLinks.map(({ short, full }) => (
                    <li key={short} className="hover:scale-110 transition duration-300">
                        <a
                        href={`https://repol.ink/${short}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white-600 font-mono hover:underline"
                        >
                        repol.ink/{short}
                        </a>
                        <p className="text-sm text-gray-500 break-all">{full}</p>
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            </>
        </div>
    );

    return (
        <>
        {status === 0 && renderForm()}
        {status === 1 && renderSuccess()}
        {status === 0 && savedLinks.length > 0 && renderSavedLinks()}
        </>
    );
};

export default Content;