package org.haoyi.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.haoyi.entity.Node;
import org.haoyi.entity.NodeNeo;
import org.haoyi.entity.OdPair;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class JsonUtil {

    public static List<OdPair> readJsonFile(String file) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return Arrays.asList(mapper.readValue(new File(file), OdPair[].class));
    }

    public static List<Node> readNodeJsonFile(String file) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return Arrays.asList(mapper.readValue(new File(file), Node[].class));
    }

    public static void writeJsonFile(String file, List<OdPair> pairs) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(new File(file), pairs);
    }

    public static void writeNodeJsonFile(String file, List<NodeNeo> nodeNeos) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(new File(file), nodeNeos);
    }
}
