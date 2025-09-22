import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Service Title",
      validation: Rule => Rule.required().min(3).max(100)
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
      title: "Service Provider"
    }),
    defineField({
      name: "category",
      type: "string",
      title: "Service Category",
      options: {
        list: [
          { title: "Accommodation", value: "accommodation" },
          { title: "Surfing Lessons", value: "surfing" },
          { title: "Tours & Activities", value: "tours" },
          { title: "Food & Catering", value: "food" },
          { title: "Transport", value: "transport" },
          { title: "Home Services", value: "home" },
          { title: "Beauty & Wellness", value: "beauty" },
          { title: "Events", value: "events" },
          { title: "Other", value: "other" }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "location",
      type: "geopoint",
      title: "Service Location",
      description: "Where is this service located in Jeffreys Bay?",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "serviceRadius",
      type: "number",
      title: "Service Radius (km)",
      description: "How far are you willing to travel for this service?",
      initialValue: 5,
      validation: Rule => Rule.min(1).max(50)
    }),
    defineField({
      name: "contactMethod",
      type: "string",
      title: "Preferred Contact Method",
      options: {
        list: [
          { title: "Phone", value: "phone" },
          { title: "WhatsApp", value: "whatsapp" },
          { title: "Email", value: "email" },
          { title: "In Person", value: "person" }
        ]
      }
    }),
    defineField({
      name: "contactDetails",
      type: "string",
      title: "Contact Information",
      description: "Phone number, email, or WhatsApp number"
    }),
    defineField({
      name: "priceRange",
      type: "string",
      title: "Price Range",
      options: {
        list: [
          { title: "Free", value: "free" },
          { title: "R0 - R100", value: "budget" },
          { title: "R100 - R500", value: "moderate" },
          { title: "R500 - R1000", value: "premium" },
          { title: "R1000+", value: "luxury" },
          { title: "Contact for Quote", value: "quote" }
        ]
      }
    }),
    defineField({
      name: "availability",
      type: "array",
      title: "Available Days",
      of: [{
        type: "string",
        options: {
          list: [
            { title: "Monday", value: "monday" },
            { title: "Tuesday", value: "tuesday" },
            { title: "Wednesday", value: "wednesday" },
            { title: "Thursday", value: "thursday" },
            { title: "Friday", value: "friday" },
            { title: "Saturday", value: "saturday" },
            { title: "Sunday", value: "sunday" }
          ]
        }
      }]
    }),
    defineField({
      name: "views",
      type: "number",
      initialValue: 0
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Service Description",
      validation: Rule => Rule.required().min(20).max(500)
    }),
    defineField({
      name: "image",
      type: "string",
      title: "Service Image URL"
    }),
    defineField({
      name: "pitch",
      title: "Detailed Service Information",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      title: "Service Active",
      initialValue: true,
      description: "Is this service currently available?"
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured Service",
      initialValue: false,
      description: "Should this service be featured on the homepage?"
    })
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      location: "location"
    },
    prepare({ title, category, location }) {
      return {
        title: title,
        subtitle: `${category} ${location ? `• ${location.lat?.toFixed(3)}, ${location.lng?.toFixed(3)}` : ''}`
      }
    }
  }
});