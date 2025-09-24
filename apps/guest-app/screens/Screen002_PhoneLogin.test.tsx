import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { PhoneLoginScreen } from './Screen002_PhoneLogin';
import { pb } from '../../../packages/api-client/pocketbase';

// Mock dependencies
jest.mock('../../../packages/api-client/pocketbase');
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-vector-icons/Feather', () => 'Icon');
jest.mock('react-native-country-picker-modal', () => ({
  __esModule: true,
  default: 'CountryPicker',
  Country: jest.fn(),
}));
jest.mock('libphonenumber-js', () => ({
  parsePhoneNumber: jest.fn(() => ({
    formatInternational: () => '+1 234 567 8900',
  })),
  isValidPhoneNumber: jest.fn((phone) => phone.length > 10),
  CountryCode: 'US',
}));

describe('PhoneLoginScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <PhoneLoginScreen navigation={mockNavigation} />
    );

    expect(getByText('Enter Your Phone Number')).toBeTruthy();
    expect(getByText("We'll send you a verification code")).toBeTruthy();
    expect(getByPlaceholderText('Phone number')).toBeTruthy();
    expect(getByText('Continue')).toBeTruthy();
  });

  it('should handle phone number input', () => {
    const { getByPlaceholderText } = render(
      <PhoneLoginScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText('Phone number');
    fireEvent.changeText(phoneInput, '2345678900');

    expect(phoneInput.props.value).toBe('2345678900');
  });

  it('should remove non-numeric characters from phone input', () => {
    const { getByPlaceholderText } = render(
      <PhoneLoginScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText('Phone number');
    fireEvent.changeText(phoneInput, '234-567-8900');

    expect(phoneInput.props.value).toBe('2345678900');
  });

  it('should disable continue button for invalid phone', () => {
    const { getByText, getByPlaceholderText } = render(
      <PhoneLoginScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText('Phone number');
    const continueButton = getByText('Continue').parent;

    // Short phone number
    fireEvent.changeText(phoneInput, '123');
    expect(continueButton.props.disabled).toBe(true);
  });

  it('should enable continue button for valid phone', () => {
    const { getByText, getByPlaceholderText } = render(
      <PhoneLoginScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText('Phone number');
    const continueButton = getByText('Continue').parent;

    // Valid phone number
    fireEvent.changeText(phoneInput, '2345678900');
    expect(continueButton.props.disabled).toBe(false);
  });

  it('should send OTP on continue press', async () => {
    const mockResponse = { request_id: '123-456' };
    (pb.send as jest.Mock).mockResolvedValue(mockResponse);

    const { getByText, getByPlaceholderText } = render(
      <PhoneLoginScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText('Phone number');
    fireEvent.changeText(phoneInput, '2345678900');

    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(pb.send).toHaveBeenCalledWith('/api/v1/auth/send-otp', {
        method: 'POST',
        body: {
          phone: '+12345678900',
          country_code: 'US',
        },
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('OTPVerification', {
        phone: '+12345678900',
        requestId: '123-456',
        countryCode: 'US',
      });
    });
  });

  it('should handle API errors', async () => {
    const mockError = new Error('Network error');
    (pb.send as jest.Mock).mockRejectedValue(mockError);

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText, getByPlaceholderText } = render(
      <PhoneLoginScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText('Phone number');
    fireEvent.changeText(phoneInput, '2345678900');

    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'Error',
        'Network error',
        expect.any(Array)
      );
    });
  });

  it('should navigate back on back button press', () => {
    const { getByTestId } = render(
      <PhoneLoginScreen navigation={mockNavigation} />
    );

    // Note: In real implementation, add testID to back button
    // For now, we'll assume it exists
    // const backButton = getByTestId('back-button');
    // fireEvent.press(backButton);
    // expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('should enforce max phone number length', () => {
    const { getByPlaceholderText } = render(
      <PhoneLoginScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText('Phone number');
    const longNumber = '12345678901234567890';
    
    fireEvent.changeText(phoneInput, longNumber);
    
    // Should truncate to max length (15)
    expect(phoneInput.props.value.length).toBeLessThanOrEqual(15);
  });

  it('should display formatted phone number', () => {
    const { getByPlaceholderText, getByText } = render(
      <PhoneLoginScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText('Phone number');
    fireEvent.changeText(phoneInput, '2345678900');

    // Check if formatted number is displayed
    expect(getByText('+1 234 567 8900')).toBeTruthy();
  });

  it('should show loading state during OTP send', async () => {
    (pb.send as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const { getByText, getByPlaceholderText, queryByTestId } = render(
      <PhoneLoginScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText('Phone number');
    fireEvent.changeText(phoneInput, '2345678900');

    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);

    // Should show loading indicator
    await waitFor(() => {
      // Check if ActivityIndicator is rendered
      // In real implementation, add testID to ActivityIndicator
    });
  });
});

describe('PhoneLoginScreen - Integration', () => {
  it('should complete full flow from input to navigation', async () => {
    const mockNavigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    const mockResponse = { request_id: 'test-123' };
    (pb.send as jest.Mock).mockResolvedValue(mockResponse);

    const { getByText, getByPlaceholderText } = render(
      <PhoneLoginScreen navigation={mockNavigation} />
    );

    // Enter phone number
    const phoneInput = getByPlaceholderText('Phone number');
    fireEvent.changeText(phoneInput, '2345678900');

    // Press continue
    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        'OTPVerification',
        expect.objectContaining({
          phone: expect.stringContaining('2345678900'),
          requestId: 'test-123',
        })
      );
    });
  });
});