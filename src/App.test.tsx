import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';
test('provides entry into learning and unrestricted sandbox',()=>{render(<App/>); expect(screen.getByRole('heading',{name:'Subnet City'})).toBeVisible();expect(screen.getByRole('button',{name:'Learn'})).toBeVisible();expect(screen.getByRole('button',{name:'Sandbox'})).toBeVisible();});
