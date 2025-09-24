import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SplashScreen } from './SplashScreen';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('SplashScreen - Screen 001', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render logo and title correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <SplashScreen />
      </NavigationContainer>
    );

    expect(getByText('🌍')).toBeTruthy();
    expect(getByText('OneMoment')).toBeTruthy();
    expect(getByText('Break Language Barriers')).toBeTruthy();
  });

  it('should display version number', () => {
    const { getByText } = render(
      <NavigationContainer>
        <SplashScreen config={{ appVersion: '1.2.3' }} />
      </NavigationContainer>
    );

    expect(getByText('v1.2.3')).toBeTruthy();
  });

  it('should navigate to PhoneLogin when not authenticated', async () => {
    render(
      <NavigationContainer>
        <SplashScreen config={{ minimumLoadTime: 1000 }} />
      </NavigationContainer>
    );

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('PhoneLogin');
      },
      { timeout: 1500 }
    );
  });

  it('should respect minimum load time', async () => {
    const startTime = Date.now();
    
    render(
      <NavigationContainer>
        <SplashScreen config={{ minimumLoadTime: 2000 }} />
      </NavigationContainer>
    );

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalled();
      },
      { timeout: 2500 }
    );

    const endTime = Date.now();
    expect(endTime - startTime).toBeGreaterThanOrEqual(2000);
  });

  it('should validate config with Zod schema', () => {
    // This should not throw
    expect(() => {
      render(
        <NavigationContainer>
          <SplashScreen 
            config={{ 
              appVersion: '1.0.0',
              minimumLoadTime: 3000,
              animationDuration: 1000
            }} 
          />
        </NavigationContainer>
      );
    }).not.toThrow();
  });

  it('should handle invalid config gracefully', () => {
    // Invalid minimumLoadTime should be caught by Zod
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      render(
        <NavigationContainer>
          <SplashScreen 
            config={{ 
              minimumLoadTime: 500 // Too short, min is 1000
            }} 
          />
        </NavigationContainer>
      );
    }).toThrow();
    
    consoleError.mockRestore();
  });
});

// BDD Scenarios
describe('SplashScreen BDD Scenarios', () => {
  describe('Given user opens the app', () => {
    describe('When app is loading', () => {
      it('Then should show animated logo', async () => {
        const { getByText } = render(
          <NavigationContainer>
            <SplashScreen />
          </NavigationContainer>
        );

        const logo = getByText('🌍');
        expect(logo).toBeTruthy();
        // Logo should be animating (check style props)
        expect(logo.props.style).toBeDefined();
      });

      it('Then should show progress bar', () => {
        const { container } = render(
          <NavigationContainer>
            <SplashScreen />
          </NavigationContainer>
        );

        const progressBar = container.querySelector('[data-testid="progress-bar"]');
        expect(progressBar).toBeTruthy();
      });
    });

    describe('When loading is complete', () => {
      it('Then should navigate to login if not authenticated', async () => {
        render(
          <NavigationContainer>
            <SplashScreen config={{ minimumLoadTime: 1000 }} />
          </NavigationContainer>
        );

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('PhoneLogin');
        });
      });
    });
  });
});