import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../utils/Stylization';
import { TextInputMask } from 'react-native-masked-text';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

const InputMask = ({
    /**
     * Tipo da Máscara a ser aplicada
     * 'credit-card', 'cpf', 'cnpj', 'zip-code', 'only-numbers', 'money', 'cel-phone', 'datetime', 'custom'
     * Valor padrão: Indefinido => Irá gerar erro.
     */
    type,

    /**
     * Texto exibido como etiqueta do campo.
     * Valor padrão: Indefinido.
     */
    label,

    /**
     * Armazena o valor inserido no campo.
     * Valor padrão: Indefinido.
     */
    value,

    /**
     * Máximo de caracteres que podem ser digitados.
     * Valor padrão: Indefinido.
     */
    maxLength,

    /**
     * Estilização específica.
     * É aplicada junto e/ou sobrescrevendo a estilização padrão.
     * Valor padrão: Vazio.
     */
    style = {},

    /**
     * Mensagem descritiva sobre o que inserir no campo.
     * Valor padrão: Indefinido.
     */
    placeholder,

    /**
     * Opções da máscara aplicada.
     * Valor padrão: Vazio.
     */
    options = {},

    /**
     * Modo predefinido do campo.
     * Valor padrão: Plano/Liso.
     */
    mode = 'flat',

    /**
     * Habilita ou desabilita a edição do valor do campo.
     * Valor padrão: Habilitado.
     */
    editable = true,

    /**
     * Tipo do valor a ser inserido no campo.
     * 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
     * Valor padrão: Texto.
     */
    inputMode = 'text',

    /**
     * Oculta o valor do campo.
     * Usado para preenchimento de senhas.
     * Valor padrão: Desativado.
     */
    secureTextEntry = false,

    /**
     * Gatilho disparado sempre que houver alterações no valor.
     * Valor padrão: Função vazia.
     */
    onChangeValue = () => { },

    /**
     * Cor da mensagem descritiva do campo.
     * Valor padrão: Cinza.
     */
    placeholderColor = Colors.grey,
}) => {
    if (!['credit-card', 'cpf', 'cnpj', 'zip-code', 'only-numbers', 'money', 'cel-phone', 'datetime', 'custom'].includes(type)) {
        throw new Error(`Property "type" not specified`)
    }

    const [isFocused, setIsFocused] = useState(false)

    return (
        <TextInputMask
            type={type}
            value={value}
            options={options}
            editable={editable}
            inputMode={inputMode}
            maxLength={maxLength}
            placeholder={placeholder}
            onChangeText={onChangeValue}
            secureTextEntry={secureTextEntry}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            placeholderTextColor={placeholderColor}
            style={[styles.input(editable, isFocused), style]}
            customTextInputProps={{
                mode: mode,
                label: label,
                theme: { colors: { primary: Colors.blue } },
            }}
        />
    );
};

const styles = StyleSheet.create({
    input: (editable, isFocused) => {
        return {
            fontSize: 18,
            marginBottom: 5,
            paddingLeft: 30,
            borderRadius: 10,
            color: Colors.black,
            flexDirection: 'row',
            width: ScreenWidth * 0.8,
            height: ScreenHeight * 0.07,
            opacity: editable ? 1 : 0.5,
            backgroundColor: Colors.grey_lighten,
            borderBottomWidth: isFocused ? 1.5 : 0.5,
            borderBottomColor: isFocused ? Colors.blue : Colors.grey_darken,
        }
    },
});

export default InputMask;
