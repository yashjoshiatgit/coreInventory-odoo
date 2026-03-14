CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    reset_otp VARCHAR(10),
    reset_otp_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE warehouses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations (
    id BIGSERIAL PRIMARY KEY,
    warehouse_id BIGINT REFERENCES warehouses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE units_of_measure (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(10) NOT NULL
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    uom_id BIGINT REFERENCES units_of_measure(id) ON DELETE RESTRICT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_stock (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    location_id BIGINT REFERENCES locations(id) ON DELETE CASCADE,
    quantity_on_hand DECIMAL(15,2) DEFAULT 0.0,
    reserved_quantity DECIMAL(15,2) DEFAULT 0.0,
    UNIQUE(product_id, location_id)
);

CREATE TABLE reorder_rules (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    location_id BIGINT REFERENCES locations(id) ON DELETE CASCADE,
    min_qty DECIMAL(15,2) DEFAULT 0.0,
    max_qty DECIMAL(15,2) DEFAULT 0.0,
    is_enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_type VARCHAR(50) NOT NULL, -- vendor, customer, internal
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT
);

CREATE TABLE stock_documents (
    id BIGSERIAL PRIMARY KEY,
    ref VARCHAR(100) UNIQUE NOT NULL,
    doc_type VARCHAR(50) NOT NULL, -- receipt, delivery, internal_transfer, adjustment
    status VARCHAR(50) NOT NULL, -- draft, waiting, ready, done, cancelled
    partner_id BIGINT REFERENCES contacts(id) ON DELETE SET NULL,
    scheduled_date TIMESTAMP,
    note TEXT,
    created_by BIGINT REFERENCES users(id) ON DELETE RESTRICT,
    validated_by BIGINT REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stock_lines (
    id BIGSERIAL PRIMARY KEY,
    stock_document_id BIGINT REFERENCES stock_documents(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE RESTRICT,
    from_location_id BIGINT REFERENCES locations(id) ON DELETE RESTRICT,
    to_location_id BIGINT REFERENCES locations(id) ON DELETE RESTRICT,
    quantity DECIMAL(15,2) NOT NULL,
    unit_cost DECIMAL(15,2),
    note TEXT
);

CREATE TABLE stock_ledger (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE RESTRICT,
    from_location_id BIGINT REFERENCES locations(id) ON DELETE RESTRICT,
    to_location_id BIGINT REFERENCES locations(id) ON DELETE RESTRICT,
    quantity DECIMAL(15,2) NOT NULL,
    entry_type VARCHAR(50) NOT NULL, -- in, out, adjust
    ref_document_id BIGINT REFERENCES stock_documents(id) ON DELETE RESTRICT,
    running_balance DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE RESTRICT
);

-- Seed Data --
INSERT INTO users (email, name, password_hash, role) VALUES ('admin@coreinventory.com', 'Admin User', '$2a$10$xyz', 'ADMIN');
INSERT INTO users (id, email, name, password_hash, role) VALUES (2, 'manager@coreinventory.com', 'Inventory Manager', '$2a$10$xyz', 'ADMIN') ON CONFLICT DO NOTHING;
INSERT INTO users (id, email, name, password_hash, role) VALUES (3, 'staff@coreinventory.com', 'Warehouse Staff', '$2a$10$xyz', 'USER') ON CONFLICT DO NOTHING;
-- Warehouses
INSERT INTO warehouses (id, name, short_code, address) VALUES (1, 'Main Warehouse', 'WH', '123 Supply St') ON CONFLICT DO NOTHING;
INSERT INTO warehouses (id, name, short_code, address) VALUES (2, 'Overflow Warehouse', 'WH2', '456 Backup Rd') ON CONFLICT DO NOTHING;

-- Locations
INSERT INTO locations (id, warehouse_id, name, code, description) VALUES (1, 1, 'Receiving Dock', 'REC', 'Inbound staging') ON CONFLICT DO NOTHING;
INSERT INTO locations (id, warehouse_id, name, code, description) VALUES (2, 1, 'Rack A', 'RACK-A', 'Primary pick face') ON CONFLICT DO NOTHING;
INSERT INTO locations (id, warehouse_id, name, code, description) VALUES (3, 1, 'Shipping Dock', 'SHIP', 'Outbound staging') ON CONFLICT DO NOTHING;
INSERT INTO locations (id, warehouse_id, name, code, description) VALUES (4, 1, 'Production Floor', 'PROD', 'WIP area') ON CONFLICT DO NOTHING;
INSERT INTO locations (id, warehouse_id, name, code, description) VALUES (5, 2, 'Overflow Rack', 'OVR-A', 'Backup storage') ON CONFLICT DO NOTHING;

-- Categories
INSERT INTO categories (id, name) VALUES (1, 'Furniture') ON CONFLICT DO NOTHING;
INSERT INTO categories (id, name) VALUES (2, 'Raw Materials') ON CONFLICT DO NOTHING;
INSERT INTO categories (id, name) VALUES (3, 'Finished Goods') ON CONFLICT DO NOTHING;

-- Units of Measure
INSERT INTO units_of_measure (id, name, symbol) VALUES (1, 'Units', 'U') ON CONFLICT DO NOTHING;
INSERT INTO units_of_measure (id, name, symbol) VALUES (2, 'Kilograms', 'Kg') ON CONFLICT DO NOTHING;
INSERT INTO units_of_measure (id, name, symbol) VALUES (3, 'Boxes', 'Box') ON CONFLICT DO NOTHING;

-- Products
INSERT INTO products (id, sku, name, category_id, uom_id, description) VALUES (1, 'CH-001', 'Office Chair', 1, 1, 'Ergonomic Chair') ON CONFLICT DO NOTHING;
INSERT INTO products (id, sku, name, category_id, uom_id, description) VALUES (2, 'TB-002', 'Standing Desk', 1, 1, 'Adjustable height') ON CONFLICT DO NOTHING;
INSERT INTO products (id, sku, name, category_id, uom_id, description) VALUES (3, 'STL-RAW-100', 'Steel Rods', 2, 2, 'Raw steel rods') ON CONFLICT DO NOTHING;
INSERT INTO products (id, sku, name, category_id, uom_id, description) VALUES (4, 'FRM-020', 'Metal Frame', 3, 1, 'Finished metal frame') ON CONFLICT DO NOTHING;
INSERT INTO products (id, sku, name, category_id, uom_id, description) VALUES (5, 'PKG-BOX-M', 'Packing Box Medium', 3, 3, 'Standard shipper') ON CONFLICT DO NOTHING;
INSERT INTO products (id, sku, name, category_id, uom_id, description) VALUES (6, 'BOLT-008', 'Hex Bolt M8', 2, 1, 'Hardware component') ON CONFLICT DO NOTHING;
INSERT INTO products (id, sku, name, category_id, uom_id, description) VALUES (7, 'PNT-GAL', 'Industrial Paint Gallon', 2, 2, 'Coating material') ON CONFLICT DO NOTHING;
INSERT INTO products (id, sku, name, category_id, uom_id, description) VALUES (8, 'KIT-CHAIR', 'Chair Assembly Kit', 3, 1, 'Bundle for assembly') ON CONFLICT DO NOTHING;

-- Product stock (initial on-hand per location)
INSERT INTO product_stock (product_id, location_id, quantity_on_hand, reserved_quantity) VALUES (3, 1, 100.00, 0) ON CONFLICT DO NOTHING; -- Steel at Receiving
INSERT INTO product_stock (product_id, location_id, quantity_on_hand, reserved_quantity) VALUES (3, 4, 80.00, 0) ON CONFLICT DO NOTHING;  -- Steel in Production
INSERT INTO product_stock (product_id, location_id, quantity_on_hand, reserved_quantity) VALUES (4, 4, 40.00, 0) ON CONFLICT DO NOTHING;  -- Frames in Production
INSERT INTO product_stock (product_id, location_id, quantity_on_hand, reserved_quantity) VALUES (4, 3, 15.00, 2) ON CONFLICT DO NOTHING;  -- Frames staged to ship
INSERT INTO product_stock (product_id, location_id, quantity_on_hand, reserved_quantity) VALUES (5, 2, 60.00, 0) ON CONFLICT DO NOTHING;  -- Boxes in Rack A
INSERT INTO product_stock (product_id, location_id, quantity_on_hand, reserved_quantity) VALUES (6, 2, 5.00, 0) ON CONFLICT DO NOTHING;   -- Bolts low stock
INSERT INTO product_stock (product_id, location_id, quantity_on_hand, reserved_quantity) VALUES (7, 5, 8.00, 0) ON CONFLICT DO NOTHING;   -- Paint low stock in overflow
INSERT INTO product_stock (product_id, location_id, quantity_on_hand, reserved_quantity) VALUES (8, 3, 12.00, 4) ON CONFLICT DO NOTHING;  -- Kits at shipping

-- Reorder rules (for low-stock alert demos)
INSERT INTO reorder_rules (product_id, location_id, min_qty, max_qty, is_enabled) VALUES (3, 4, 50.00, 200.00, TRUE) ON CONFLICT DO NOTHING; -- Steel in Production
INSERT INTO reorder_rules (product_id, location_id, min_qty, max_qty, is_enabled) VALUES (4, 3, 10.00, 50.00, TRUE) ON CONFLICT DO NOTHING; -- Frames at Shipping
INSERT INTO reorder_rules (product_id, location_id, min_qty, max_qty, is_enabled) VALUES (5, 2, 20.00, 100.00, TRUE) ON CONFLICT DO NOTHING; -- Boxes in Rack A
INSERT INTO reorder_rules (product_id, location_id, min_qty, max_qty, is_enabled) VALUES (6, 2, 20.00, 80.00, TRUE) ON CONFLICT DO NOTHING; -- Bolts low
INSERT INTO reorder_rules (product_id, location_id, min_qty, max_qty, is_enabled) VALUES (7, 5, 15.00, 60.00, TRUE) ON CONFLICT DO NOTHING; -- Paint low
INSERT INTO reorder_rules (product_id, location_id, min_qty, max_qty, is_enabled) VALUES (8, 3, 25.00, 80.00, TRUE) ON CONFLICT DO NOTHING; -- Kits staging

-- Contacts
INSERT INTO contacts (id, name, contact_type, email) VALUES (1, 'Super Vendor', 'vendor', 'sales@supervendor.com') ON CONFLICT DO NOTHING;
INSERT INTO contacts (id, name, contact_type, email) VALUES (2, 'Mega Customer', 'customer', 'buy@mega.com') ON CONFLICT DO NOTHING;
INSERT INTO contacts (id, name, contact_type, email) VALUES (3, 'Internal Ops', 'internal', 'ops@corp.com') ON CONFLICT DO NOTHING;

-- Additional stock in multiple locations
INSERT INTO product_stock (product_id, location_id, quantity_on_hand, reserved_quantity) VALUES (1, 2, 25.00, 0) ON CONFLICT DO NOTHING;  -- Chairs in Rack A
INSERT INTO product_stock (product_id, location_id, quantity_on_hand, reserved_quantity) VALUES (2, 5, 10.00, 0) ON CONFLICT DO NOTHING;  -- Desks in Overflow
INSERT INTO product_stock (product_id, location_id, quantity_on_hand, reserved_quantity) VALUES (5, 3, 30.00, 5) ON CONFLICT DO NOTHING;  -- Boxes at Shipping

-- Additional reorder rules
INSERT INTO reorder_rules (product_id, location_id, min_qty, max_qty, is_enabled) VALUES (1, 2, 10.00, 50.00, TRUE) ON CONFLICT DO NOTHING; -- Chairs Rack A
INSERT INTO reorder_rules (product_id, location_id, min_qty, max_qty, is_enabled) VALUES (2, 5, 5.00, 30.00, TRUE) ON CONFLICT DO NOTHING; -- Desks Overflow

-- Sample stock documents for demo (refs fixed for repeatability)
INSERT INTO stock_documents (id, ref, doc_type, status, partner_id, scheduled_date, note, created_by, validated_by)
VALUES (1, 'WH-REC-0001', 'receipt', 'done', 1, NOW() - INTERVAL '5 days', 'Seed receipt', 2, 2) ON CONFLICT DO NOTHING;
INSERT INTO stock_documents (id, ref, doc_type, status, partner_id, scheduled_date, note, created_by, validated_by)
VALUES (2, 'WH-TRF-0001', 'internal_transfer', 'done', 3, NOW() - INTERVAL '4 days', 'Seed transfer', 2, 2) ON CONFLICT DO NOTHING;
INSERT INTO stock_documents (id, ref, doc_type, status, partner_id, scheduled_date, note, created_by, validated_by)
VALUES (3, 'WH-DEL-0001', 'delivery', 'done', 2, NOW() - INTERVAL '3 days', 'Seed delivery', 3, 3) ON CONFLICT DO NOTHING;
INSERT INTO stock_documents (id, ref, doc_type, status, partner_id, scheduled_date, note, created_by, validated_by)
VALUES (4, 'WH-ADJ-0001', 'adjustment', 'done', 3, NOW() - INTERVAL '2 days', 'Seed adjustment', 2, 2) ON CONFLICT DO NOTHING;

-- Pending receipts/deliveries to show dashboards
INSERT INTO stock_documents (id, ref, doc_type, status, partner_id, scheduled_date, note, created_by, validated_by)
VALUES (5, 'WH-REC-0002', 'receipt', 'waiting', 1, NOW() + INTERVAL '1 day', 'Incoming bolts PO', 2, NULL) ON CONFLICT DO NOTHING;
INSERT INTO stock_documents (id, ref, doc_type, status, partner_id, scheduled_date, note, created_by, validated_by)
VALUES (6, 'WH-DEL-0002', 'delivery', 'waiting', 2, NOW() + INTERVAL '2 days', 'Customer shipment kits', 3, NULL) ON CONFLICT DO NOTHING;

-- Stock lines for the documents
INSERT INTO stock_lines (id, stock_document_id, product_id, from_location_id, to_location_id, quantity, unit_cost, note)
VALUES (1, 1, 3, NULL, 1, 50.00, 10.00, 'Receive steel to dock') ON CONFLICT DO NOTHING;
INSERT INTO stock_lines (id, stock_document_id, product_id, from_location_id, to_location_id, quantity, unit_cost, note)
VALUES (2, 1, 1, NULL, 2, 15.00, 30.00, 'Receive chairs to rack') ON CONFLICT DO NOTHING;
INSERT INTO stock_lines (id, stock_document_id, product_id, from_location_id, to_location_id, quantity, unit_cost, note)
VALUES (3, 2, 3, 1, 4, 40.00, NULL, 'Move steel to production') ON CONFLICT DO NOTHING;
INSERT INTO stock_lines (id, stock_document_id, product_id, from_location_id, to_location_id, quantity, unit_cost, note)
VALUES (4, 3, 4, 4, 3, 10.00, 45.00, 'Ship frames') ON CONFLICT DO NOTHING;
INSERT INTO stock_lines (id, stock_document_id, product_id, from_location_id, to_location_id, quantity, unit_cost, note)
VALUES (5, 4, 3, 4, NULL, -5.00, NULL, 'Damage adjustment') ON CONFLICT DO NOTHING;
INSERT INTO stock_lines (id, stock_document_id, product_id, from_location_id, to_location_id, quantity, unit_cost, note)
VALUES (6, 5, 6, NULL, 1, 40.00, 0.15, 'Bolts receipt incoming') ON CONFLICT DO NOTHING;
INSERT INTO stock_lines (id, stock_document_id, product_id, from_location_id, to_location_id, quantity, unit_cost, note)
VALUES (7, 6, 8, 3, NULL, 8.00, 55.00, 'Kits outbound to customer') ON CONFLICT DO NOTHING;

-- Ledger entries matching documents (simplified running balances)
INSERT INTO stock_ledger (id, product_id, from_location_id, to_location_id, quantity, entry_type, ref_document_id, running_balance, created_by)
VALUES (1, 3, NULL, 1, 50.00, 'in', 1, 150.00, 2) ON CONFLICT DO NOTHING;
INSERT INTO stock_ledger (id, product_id, from_location_id, to_location_id, quantity, entry_type, ref_document_id, running_balance, created_by)
VALUES (2, 1, NULL, 2, 15.00, 'in', 1, 40.00, 2) ON CONFLICT DO NOTHING;
INSERT INTO stock_ledger (id, product_id, from_location_id, to_location_id, quantity, entry_type, ref_document_id, running_balance, created_by)
VALUES (3, 3, 1, 4, 40.00, 'transfer', 2, 190.00, 2) ON CONFLICT DO NOTHING;
INSERT INTO stock_ledger (id, product_id, from_location_id, to_location_id, quantity, entry_type, ref_document_id, running_balance, created_by)
VALUES (4, 4, 4, 3, 10.00, 'out', 3, 45.00, 3) ON CONFLICT DO NOTHING;
INSERT INTO stock_ledger (id, product_id, from_location_id, to_location_id, quantity, entry_type, ref_document_id, running_balance, created_by)
VALUES (5, 3, 4, NULL, -5.00, 'adjust', 4, 185.00, 2) ON CONFLICT DO NOTHING;
