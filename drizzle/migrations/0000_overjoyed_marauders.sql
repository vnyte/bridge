CREATE TYPE "public"."license_classes" AS ENUM('LMV', 'MCWG', 'MCWOG', 'MGV', 'MPV', 'HGV', 'HPV');--> statement-breakpoint
CREATE TYPE "public"."vehicle_document_types" AS ENUM('PUC', 'INSURANCE', 'REGISTRATION');--> statement-breakpoint
CREATE TYPE "public"."blood_group" AS ENUM('A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-');--> statement-breakpoint
CREATE TYPE "public"."citizen_status" AS ENUM('BIRTH', 'NATURALIZED', 'CITIZEN', 'DESCENT', 'REGISTRATION');--> statement-breakpoint
CREATE TYPE "public"."educational_qualification" AS ENUM('BELOW_10TH', 'CLASS_10TH', 'CLASS_12TH', 'GRADUATE', 'POST_GRADUATE', 'OTHERS');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."client_document_types" AS ENUM('AADHAAR_CARD', 'PAN_CARD');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PARTIALLY_PAID', 'FULLY_PAID', 'PENDING');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('FULL_PAYMENT', 'INSTALLMENTS', 'PAY_LATER');--> statement-breakpoint
CREATE TYPE "public"."client_transaction_status" AS ENUM('SUCCESS', 'PENDING', 'FAILED', 'REFUNDED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."payment_mode" AS ENUM('PAYMENT_LINK', 'QR', 'CASH', 'CHEQUE');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED');--> statement-breakpoint
CREATE TYPE "public"."clerk_roles" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."staff_roles" AS ENUM('instructor', 'manager', 'accountant');--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"number" text NOT NULL,
	"rent" integer NOT NULL,
	"puc_expiry" text,
	"insurance_expiry" text,
	"registration_expiry" text,
	"branch_id" uuid NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tenant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"org_id" text NOT NULL,
	"working_days" json DEFAULT '[0,1,2,3,4,5,6]'::json,
	"operating_hours" json DEFAULT '{"start":"06:00","end":"20:00"}'::json,
	"tenant_id" uuid NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "branches_org_id_unique" UNIQUE("org_id")
);
--> statement-breakpoint
CREATE TABLE "vehicle_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"name" text,
	"type" "vehicle_document_types",
	"vehicle_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"middle_name" text,
	"last_name" text NOT NULL,
	"client_code" text NOT NULL,
	"aadhaar_number" text NOT NULL,
	"pan_number" text,
	"photo_url" text,
	"signature_url" text,
	"guardian_first_name" text,
	"guardian_middle_name" text,
	"guardian_last_name" text,
	"birth_date" text NOT NULL,
	"bloodGroup" "blood_group" NOT NULL,
	"gender" "gender" NOT NULL,
	"educationalQualification" "educational_qualification",
	"phone_number" text NOT NULL,
	"alternative_phone_number" text,
	"email" text,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"pincode" text NOT NULL,
	"is_current_address_same_as_permanent_address" boolean DEFAULT false,
	"permanent_address" text NOT NULL,
	"permanent_city" text NOT NULL,
	"permanent_state" text NOT NULL,
	"permanent_pincode" text NOT NULL,
	"citizenStatus" "citizen_status" DEFAULT 'BIRTH',
	"branch_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"tenant_id" uuid NOT NULL,
	CONSTRAINT "phone_number_tenant_unique" UNIQUE("phone_number","tenant_id")
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"number_of_sessions" integer NOT NULL,
	"session_duration_in_minutes" integer NOT NULL,
	"joining_date" text NOT NULL,
	"joining_time" time NOT NULL,
	"client_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plans_client_id_unique" UNIQUE("client_id")
);
--> statement-breakpoint
CREATE TABLE "driving_licenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class" "license_classes"[],
	"appointment_date" text,
	"license_number" text,
	"issue_date" text,
	"expiry_date" text,
	"application_number" text,
	"test_conducted_by" text,
	"imv" text,
	"rto" text,
	"department" text,
	"client_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "driving_licenses_client_id_unique" UNIQUE("client_id")
);
--> statement-breakpoint
CREATE TABLE "learning_licenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class" "license_classes"[],
	"test_conducted_on" text,
	"license_number" text,
	"issue_date" text,
	"expiry_date" text,
	"application_number" text,
	"client_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "learning_licenses_client_id_unique" UNIQUE("client_id")
);
--> statement-breakpoint
CREATE TABLE "client_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"name" text,
	"type" "client_document_types",
	"client_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"original_amount" integer NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"final_amount" integer NOT NULL,
	"payment_status" "payment_status" DEFAULT 'PENDING',
	"payment_type" "payment_type" DEFAULT 'FULL_PAYMENT',
	"full_payment_date" text,
	"full_payment_mode" "payment_mode",
	"full_payment_paid" boolean DEFAULT false,
	"first_installment_amount" integer DEFAULT 0,
	"first_payment_mode" "payment_mode",
	"first_installment_date" text,
	"first_installment_paid" boolean DEFAULT false,
	"second_installment_amount" integer DEFAULT 0,
	"second_payment_mode" "payment_mode",
	"second_installment_date" text,
	"second_installment_paid" boolean DEFAULT false,
	"payment_due_date" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_plan_id_unique" UNIQUE("plan_id")
);
--> statement-breakpoint
CREATE TABLE "client_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"payment_mode" "payment_mode" NOT NULL,
	"transaction_reference" text,
	"transaction_status" "client_transaction_status" DEFAULT 'PENDING' NOT NULL,
	"notes" text,
	"metadata" jsonb,
	"installment_number" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"session_date" text NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"status" "session_status" DEFAULT 'SCHEDULED' NOT NULL,
	"session_number" integer NOT NULL,
	"original_session_id" uuid,
	"branch_id" uuid NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_prints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"form_type" varchar(50) NOT NULL,
	"printed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"printed_by" varchar(255) NOT NULL,
	"batch_id" uuid,
	"branch_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"photo" text,
	"staff_role" "staff_roles" NOT NULL,
	"clerk_role" "clerk_roles" NOT NULL,
	"assigned_vehicle_id" uuid,
	"license_number" text,
	"license_issue_date" timestamp,
	"experience_years" text,
	"education_level" text,
	"phone" text,
	"branch_id" uuid NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "message_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" text,
	"message_type" text,
	"status" text,
	"error" text,
	"retry_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
