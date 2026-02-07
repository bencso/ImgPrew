"use client";

import {  useLanguage } from "@/providers/languageprovider";
import { IconButton, Skeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
    const { language, handleSetLanguge } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <Skeleton boxSize="8" />;

    return (
        <IconButton onClick={()=>{handleSetLanguge()}} variant="outline" size="sm">
            {language === "hu-HU" ? "🇭🇺": "🏴󠁧󠁢󠁥󠁮󠁧󠁿"}
        </IconButton>
    );
}
