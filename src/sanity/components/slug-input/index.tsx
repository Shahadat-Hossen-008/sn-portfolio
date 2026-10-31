import { Text, Flex, Box } from "@sanity/ui";
import { HiOutlineExternalLink } from "react-icons/hi";

import {
  ObjectInputProps,
  SlugOptions,
  SlugSchemaType,
  SlugValue,
} from "sanity";
import Link from "next/link";

interface CustomSlugSchemaType extends Omit<SlugSchemaType, "options"> {
  options?: SlugOptions & {
    prefix?: string;
    isFixed?: boolean;
  };
}

type CustomSlugInputProps = ObjectInputProps<SlugValue, CustomSlugSchemaType>;

export default function SlugInput(props: CustomSlugInputProps) {
  const { renderDefault, value, schemaType } = props;
  const isFixed = Boolean(schemaType.options?.isFixed);

  const segments = [schemaType.options?.prefix, value?.current].filter(Boolean);
  const relativePath = `/${segments.join("/")}`;

  return (
    <Flex gap={3} direction={"column"}>
      <Box
        flex={"auto"}
        style={{
          maxWidth: "fit-content",
        }}
        hidden={!isFixed && value?.current == undefined}
      >
        <Link
          href={relativePath}
          style={{ textDecoration: "none" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Flex gap={2} direction={"row"} align={"center"}>
            <Text size={isFixed ? 2 : 1}>{relativePath}</Text>
            <Text size={1}>
              <HiOutlineExternalLink />
            </Text>
          </Flex>
        </Link>
      </Box>

      {!isFixed && renderDefault(props)}
    </Flex>
  );
}
