import { defineField, defineType } from "sanity";
import { LinkIcon, ProjectsIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";

export const projectTemplate = defineType({
  name: "project",
  type: "document",
  title: "Project",
  icon: ProjectsIcon,
  fieldsets: [
      {
        name: "projectDuration",
        title: "Project Duration",
        description: "The time period that you worked on this project.",
        options: { columns: 2 },
      },
    ],
    fields: [
      defineField({
        name: "projectTitle",
        title: "Project Title",
        type: "string",
        validation: (rule) => rule.required().error("Please provide the title."),
      }),
      defineField({
        name: "projectImage",
        title: "Project Image",
        type: "customImage",
      }),
      defineField({
        name: "projectDescription",
        title: "Project Description",
        type: "portableText",
      }),
      defineField({
        type: "datetime",
        name: "start",
        title: "Start",
        fieldset: "projectDuration",
      }),
      defineField({
        type: "datetime",
        name: "end",
        title: "End",
        fieldset: "projectDuration",
        validation: (rule) =>
          rule
            .required()
            .min(rule.valueOfField("start"))
            .error("End date must be after start date"),
      }),
      defineField({
      name: "projectLink",
      title: "Project Link",
      icon: LinkIcon,
      type: "link",
      validation: (rule) => rule.required(),
      options:{
        enableText: true
      }
    }),
      defineField({
        name: "githubUrl",
        title: "GITHUB URL",
        description: "Link to your github repo (only https://)",
        type: "url",
        validation: (Rule) =>
          Rule.uri({
            scheme: ["https"],
          })
            .required()
            .error("A valid github URL is required"),
      }),
      defineField({
        name: "stack",
        title: "Stack",
        description: "Technologies are used in this project",
        type: "array",
        of: [{ type: "reference", to: [{ type: "category" }] }],
      }),
      defineField({
        name: "date",
        title: "Date",
        type: "datetime",
        description: "This date shows when the project was posted.",
        initialValue: () => new Date().toISOString(),
      }),
    ],
    preview: {
      select: {
        title: "projectTitle",
        date: "date",
        media: "projectImage.imageFile",
      },
      prepare({ title, date, media }) {
        return {
          title,
          subtitle: date
            ? `Posted on ${format(parseISO(date), "LLL d, yyyy")}`
            : "",
          media,
        };
      },
    },
});
