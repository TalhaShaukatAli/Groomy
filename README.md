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

### Color System

#### Base Colors
- Main Green: `#b7ddb7` - Primary interface elements
- Secondary Green: `#5c7c51` - Accents and secondary elements
- Hover Green: `#97c7a2` - Interactive state for buttons and elements
- Background: `#f8f9fa` - Page background
- Text: `black` - Primary text color

#### Usage Patterns
- Content Areas: Main green (`#b7ddb7`) for cards and primary containers
- Interactive Elements: 
  - Default: Main green
  - Hover: Hover green
  - Active/Selected: Secondary green
- Borders: 
  - Default: 2px solid transparent
  - Active: 2px/5px solid main green

### Component Styling

#### Cards & Containers
- Background: Main green
- Border Radius: 1rem for main containers, 0.5rem for smaller elements
- Shadow: `drop-shadow(rgb(88, 88, 88) 0.2rem 0.2rem 1rem)`

#### Forms & Input Fields
- Border: 2px solid main green
- Border Radius: 0.2rem
- Background: White or transparent depending on context

### Typography

- Primary Font: Lucida Sans, 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif
- Heading Sizes:
  - h2: 1.5rem
- Text Colors:
  - Primary: Black
  - Secondary: rgb(88, 88, 88)
  - Error States: rgb(248, 131, 131)

### Layout

- Background: Light background color (`#f8f9fa`)
- Sidebar: Full height (100vh)

## Technical Stack

### Frontend / Backend

- Framework: SvelteKit
- Languages:
  - TypeScript
  - JavaScript
- Database: SQLite

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
