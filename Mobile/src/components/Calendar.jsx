import DateTimePickerModal from 'react-native-modal-datetime-picker';

const Calendar = ({
    date = new Date(),
    isVisible = false,
    handleConfirm = () => { },
    hideDatePicker = () => { }
}) => {

    return (
        <DateTimePickerModal
            mode="date"
            date={new Date(date)}
            isVisible={isVisible}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
        />
    );
};

export default Calendar;
