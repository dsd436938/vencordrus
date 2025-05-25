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

import ErrorBoundary from "@components/ErrorBoundary";
import { Flex } from "@components/Flex";
import { downloadSettingsBackup, uploadSettingsBackup } from "@utils/settingsSync";
import { Button, Card, Forms, Margins, Text } from "@webpack/common";

function BackupRestoreTab() {
    return (
        <Forms.FormSection title="Синхронизация настроек">
            <Card style={{
                backgroundColor: "var(--info-warning-background)",
                borderColor: "var(--info-warning-foreground)",
                color: "var(--info-warning-text)",
                padding: "1em",
                marginBottom: "0.5em",
            }}>
                <Flex flexDirection="column">
                    <strong>Внимание!</strong>
                    <span>Импортирование настроек из файла перезапишет ваши текущие настройки.</span>
                </Flex>
            </Card>
            <Text variant="text-md/normal" className={Margins.marginBottom8}>
                Вы можете импортировать и экспортировать ваши настройки Vencord как JSON файл.
                Это позволяет вам переносить ваши настройки с одного устройства на другое,
                или восстанавливать их после переустановки Vencord или Discord.
            </Text>
            <Text variant="text-md/normal" className={Margins.marginBottom8}>
                Экспорт настроек включает в себя:
                <ul>
                    <li>&mdash; Кастомный QuickCSS</li>
                    <li>&mdash; Настройки плагинов</li>
                </ul>
            </Text>
            <Flex>
                <Button
                    onClick={uploadSettingsBackup}
                    size={Button.Sizes.SMALL}
                >
                    Импортировать настройки
                </Button>
                <Button
                    onClick={downloadSettingsBackup}
                    size={Button.Sizes.SMALL}
                >
                    Экспортировать настройки
                </Button>
            </Flex>
        </Forms.FormSection>
    );
}

export default ErrorBoundary.wrap(BackupRestoreTab);
