# Software Engineering Technical Specification

## Overview

This document outlines the technical specifications for a web-based business management system, designed to handle customer relationships, appointments, and payments.

## Functional Requirements

- User can create an account
- User can login / authenticate
- User can CRUD customers
- User can CRUD appointments
- User can CRUD notes
- User can CRUD services
- User can CRUD invoices
- User can see a map of the local area
- User can view a path from current location to the next appointment on the map
- User can take payments
- (Anything else can be added later)

## Non-functional Requirements

- Web-based application
- Remote access capability
- Cross-platform compatibility
- Responsive design

## Design Guidelines

### Color Palette

- Primary Blue: `#50869e`
- Secondary Blue: `#2f7ea0`
- Hover Blue: `#3c6c85`
- Background: `#faf6f2` (Off-white)

### Fonts

- Primary Font: Lucida Sans
- Default Text Color: White
- Headings: Primary Blue

### Input Buttons

- Border: None
- Border Radius: 0.25rem

### Form Buttons

- Default Border: 2px solid transparent
- Hover Border: 2px solid yellow
- Border Radius: 0.25rem

### Layout

- Background: Off-white (`#faf6f2`)
- Sidebar: Primary Blue (`#50869e`) with black text

## Technical Stack

### Frontend / Backend

- Framework: SvelteKit
- Languages:
  - TypeScript
  - JavaScript
- Database: MongoDB

### Project Structure

- Source code: `/src` directory
- UI tests: `/tests` directory
- Unit tests: Located with source files

### Naming Conventions

- General code: camelCase
- Variables: camelCase
- Functions: camelCase
- Classes: PascalCase
- Components: PascalCase
