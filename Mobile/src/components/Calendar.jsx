import DateTimePickerModal from 'react-native-modal-datetime-picker';

const Calendar = ({
    isVisible = false,
    handleConfirm = () => { },
    hideDatePicker = () => { }
}) => {

    return (
        <DateTimePickerModal
            mode="date"
            isVisible={isVisible}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
        />
    );
};

export default Calendar;
