import React from 'react'

const PWAInstallPrompt = () => {
    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault(); // block auto-prompt
            setDeferredPrompt(e);
            setShowInstallButton(true); // show custom "Install" button
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                console.log("User accepted the install prompt");
            } else {
                console.log("User dismissed the install prompt");
            }
            setDeferredPrompt(null);
            setShowInstallButton(false);
        }
    };
    return (
<div>empty</div>
    )
}

export default PWAInstallPrompt