/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { useSettings } from "@api/settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Link } from "@components/Link";
import { useAwaiter } from "@utils/misc";
import { findLazy } from "@webpack";
import { Card, Forms, Margins, React, TextArea } from "@webpack/common";

const TextAreaProps = findLazy(m => typeof m.textarea === "string");

function Validator({ link }: { link: string; }) {
    const [res, err, pending] = useAwaiter(() => fetch(link).then(res => {
        if (res.status > 300) throw `${res.status} ${res.statusText}`;
        const contentType = res.headers.get("Content-Type");
        if (!contentType?.startsWith("text/css") && !contentType?.startsWith("text/plain"))
            throw "Not a CSS file. Remember to use the raw link!";

        return "Okay!";
    }));

    const text = pending
        ? "Checking..."
        : err
            ? `Error: ${err instanceof Error ? err.message : String(err)}`
            : "Valid!";

    return <Forms.FormText style={{
        color: pending ? "var(--text-muted)" : err ? "var(--text-danger)" : "var(--text-positive)"
    }}>{text}</Forms.FormText>;
}

function Validators({ themeLinks }: { themeLinks: string[]; }) {
    if (!themeLinks.length) return null;

    return (
        <>
            <Forms.FormTitle className={Margins.marginTop20} tag="h5">Валидатор</Forms.FormTitle>
            <Forms.FormText>В этом разделе вы узнаете, могут ли ваши темы быть успешно загружены</Forms.FormText>
            <div>
                {themeLinks.map(link => (
                    <Card style={{
                        padding: ".5em",
                        marginBottom: ".5em"
                    }} key={link}>
                        <Forms.FormTitle tag="h5" style={{
                            overflowWrap: "break-word"
                        }}>
                            {link}
                        </Forms.FormTitle>
                        <Validator link={link} />
                    </Card>
                ))}
            </div>
        </>
    );
}

export default ErrorBoundary.wrap(function () {
    const settings = useSettings();
    const ref = React.useRef<HTMLTextAreaElement>();

    function onBlur() {
        settings.themeLinks = [...new Set(
            ref.current!.value
                .trim()
                .split(/\n+/)
                .map(s => s.trim())
                .filter(Boolean)
        )];
    }

    return (
        <>
            <Card style={{
                padding: "1em",
                marginBottom: "1em",
                marginTop: "1em"
            }}>
                <Forms.FormTitle tag="h5">Вставьте сюда ссылку на .css / .theme.css файлы</Forms.FormTitle>
                <Forms.FormText>Одна ссылка на одну строку</Forms.FormText>
                <Forms.FormText>Будьте осторожны при использовании прямых ссылок или ссылок на github.io!</Forms.FormText>
                <Forms.FormDivider />
                <Forms.FormTitle tag="h5">Найти темы:</Forms.FormTitle>
                <div>
                    <Link style={{ marginRight: ".5em" }} href="https://betterdiscord.app/themes">
                        BetterDiscord темы
                    </Link>
                    <Link href="https://github.com/search?q=discord+theme">Github</Link>
                </div>
                <Forms.FormText>Если вы используете сайт BetterDiscord, нажмите на "Source"</Forms.FormText>
                <Forms.FormText>В репозитории вашей темы на GitHub найдите X.theme.css / X.css, щелкните по нему, затем нажмите кнопку "Raw"</Forms.FormText>
                <Forms.FormText>
                    Если тема содержит конфиг, который надо отредактировать:
                    <ul>
                        <li>• Создайте аккаунт Github</li>
                        <li>• Нажмите на кнопку "Fork" (справа вверху)</li>
                        <li>• Измените файл конфига</li>
                        <li>• Используйте ссылку СВОЕГО репозитория</li>
                    </ul>
                </Forms.FormText>
            </Card>
            <Forms.FormTitle tag="h5">Темы</Forms.FormTitle>
            <TextArea
                style={{
                    padding: ".5em",
                    border: "1px solid var(--background-modifier-accent)"
                }}
                ref={ref}
                defaultValue={settings.themeLinks.join("\n")}
                className={TextAreaProps.textarea}
                placeholder="Theme Links"
                spellCheck={false}
                onBlur={onBlur}
            />
            <Validators themeLinks={settings.themeLinks} />
        </>
    );
});
