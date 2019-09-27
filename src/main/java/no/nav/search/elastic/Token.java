package no.nav.search.elastic;

import com.enonic.xp.script.serializer.MapGenerator;
import com.enonic.xp.script.serializer.MapSerializable;
import org.elasticsearch.action.admin.indices.analyze.AnalyzeResponse.AnalyzeToken;
import java.util.List;

public final class Token
implements MapSerializable {
    private final AnalyzeToken token;

    public Token(AnalyzeToken token) {
        this.token = token;
    }

    @Override
    public void serialize(MapGenerator gen) {
        gen.value("endOffset", token.getEndOffset());
        gen.value("startOffset", token.getStartOffset());
        gen.value("position", token.getPosition());
        gen.value("term", token.getTerm());
        gen.value("type", token.getType());
    }
}
