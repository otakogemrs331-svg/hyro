Antigravity: Luxury E-Commerce Platform

Project Overview

Antigravity is a premium, high-end e-commerce platform designed to offer a curated selection of luxury books and elite reading accessories. Blending sophisticated typography with an organic nature aesthetic, the platform aims to inspire exploration and provide an unparalleled shopping experience. This README outlines the project's technical specifications, architectural decisions, and functional scope.

Visual Identity & Premium UX/UI

Aesthetic Guidelines

•
Overall Feel: The platform embodies a high-end luxury and organic nature aesthetic, designed to feel like an exclusive boutique rather than a conventional storefront.

Color Palette

•
Primary Background: Deep Forest Midnight (#0B132B) or rich dark navy/green hues.

•
Accents & Highlights: Premium Metallic Gold (#D4AF37) is utilized for titles, borders, buttons, and interactive states, signifying luxury.

•
Text: Clean cream/off-white ensures optimal contrast and readability across the platform.

Micro-interactions

•
Hover Transitions: All interactive elements, including cards, buttons, and navigation items, feature smooth, bespoke hover transitions (transition-all duration-300). The design strictly avoids basic, unstyled HTML elements to maintain a premium feel.

Core Architecture & Tech Stack

Frontend

•
Framework: Next.js 15 (App Router)

•
Styling: Tailwind CSS

•
Language: TypeScript

Backend & Authentication

•
Platform: Supabase

State Management & Data Fetching

•
Approach: Leverages Next.js 15 Server Components by default, with robust asynchronous dynamic parameter handling for routing.

Icons

•
Implementation: Optimized inline SVGs are exclusively used. This approach avoids heavy third-party icon packages, preventing potential Webpack/bundle compilation errors and optimizing performance.

Database Architecture & Supabase Integration

Database Schema Generation

•
The project includes a root-level supabase/schema.sql file. This file contains clean, optimized SQL DDL (Data Definition Language) scripts for automatic generation of all necessary tables, relationships, constraints, and indexes.

Required Tables

•
Users/Profiles

•
Products (includes stock, price, category, and theme tags)

•
Categories

•
Orders

•
Order_Items

•
Inventory_Logs

Security & Environment Variables

•
API Keys: Supabase API keys and database connection strings are never hardcoded within the codebase.

•
Environment Template: A .env.local.example file template is provided for easy setup.

•
Credential Loading: The application strictly reads credentials from a local .env.local file using NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.

Functional Scope

Storefront & Discovery

•
Navigation: Intuitive navigation allows users to filter products by genre, author, or unique "Outdoor Theme" categories (e.g., Trail Reading, Survival, Deep Woods).

Cart & Checkout

•
Simulator: Features a secure client-side state checkout simulator.

•
Calculations: Dynamic tax and shipping calculations are integrated.

•
Post-Purchase: Triggers for post-purchase simulated automated tracking emails enhance the customer experience.

Lightweight CMS Panel

•
Admin Section: A secure admin routing section (app/admin/*) is connected to Supabase, enabling comprehensive management of inventory, product descriptions, discount codes, and sales metrics.

SEO & Performance

•
Metadata: Strict Metadata implementation for Next.js 15 ensures optimal search engine visibility.

•
HTML: Semantic HTML tags are used throughout for accessibility and SEO.

•
URLs: Dynamic friendly URLs (e.g., /products/[slug]) improve user experience and search engine indexing.

•
Images: Descriptive image alt tags are included for all visual content.

Bonus Feature: Blog Section

•
A clean, minimal blog section is included for trail reviews and reading lists, further reinforcing the brand's narrative and engaging the audience.

