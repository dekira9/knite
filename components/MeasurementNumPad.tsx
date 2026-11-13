import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  unit: string;
  /** Allow decimal point (for inches). */
  allowDecimal?: boolean;
  /** Max characters including decimal point. */
  maxLength?: number;
};

const KEYS_INTEGER = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['C', '0', '⌫'],
] as const;

const KEYS_DECIMAL = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
] as const;

export default function MeasurementNumPad({
  value,
  onValueChange,
  unit,
  allowDecimal = false,
  maxLength = 3,
}: Props) {
  const [display, setDisplay] = useState(value);
  const replaceNext = useRef(true);

  useEffect(() => {
    setDisplay((prev) => {
      if (prev === value) return prev;
      replaceNext.current = true;
      return value;
    });
  }, [value]);

  const commit = (next: string) => {
    setDisplay(next);
    onValueChange(next);
  };

  const onKey = (key: string) => {
    if (key === 'C') {
      replaceNext.current = true;
      commit('');
      return;
    }
    if (key === '⌫') {
      const next = display.slice(0, -1);
      if (!next) replaceNext.current = true;
      commit(next);
      return;
    }
    if (key === '.') {
      if (!allowDecimal || display.includes('.')) return;
      const base = replaceNext.current || display === '' ? '0' : display;
      replaceNext.current = false;
      commit(`${base}.`);
      return;
    }

    // digit
    if (replaceNext.current || display === '') {
      replaceNext.current = false;
      commit(key);
      return;
    }
    if (display.length >= maxLength) return;
    // at most one digit after decimal
    if (allowDecimal && display.includes('.')) {
      const frac = display.split('.')[1] ?? '';
      if (frac.length >= 1) return;
    }
    commit(display + key);
  };

  const rows = allowDecimal ? KEYS_DECIMAL : KEYS_INTEGER;

  return (
    <View style={styles.wrap}>
      <View style={styles.display}>
        <Text style={styles.displayValue} numberOfLines={1}>
          {display || '—'}
        </Text>
        <Text style={styles.displayUnit}>{unit}</Text>
      </View>

      <View style={styles.pad}>
        {rows.map((row) => (
          <View key={row.join('-')} style={styles.row}>
            {row.map((key) => {
              const isAction = key === 'C' || key === '⌫' || key === '.';
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.key, isAction && styles.keyAction]}
                  onPress={() => onKey(key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.keyText, isAction && styles.keyActionText]}>{key}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  display: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    minHeight: 52,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  displayValue: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
  displayUnit: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  pad: {
    width: '100%',
    maxWidth: 300,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  key: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E4E7',
  },
  keyAction: {
    backgroundColor: '#E8F4F8',
    borderColor: Colors.light.tint,
  },
  keyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  keyActionText: {
    color: Colors.light.tint,
  },
});
