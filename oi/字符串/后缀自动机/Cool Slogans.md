# Cool Slogans
[CF700E]

给出一个长度为n的字符串s[1]，由小写字母组成。定义一个字符串序列s[1....k],满足性质：s[i]在s[i-1] (i>=2)中出现至少两次（位置可重叠），问最大的k是多少，使得从s[1]开始到s[k]都满足这样一个性质。

后缀自动机上一个节点表示的所有串位置相同，那么就只需要考虑 longest 了。从根开始沿着 fail 链 dp 。对于一个点，它上面所有祖先都是可以转移到它的，那么不妨就再 dfs 的时候记录一个最大的。由于要求出现次数，所以预先线段树合并处理出 endpos 集合，如果这个最大的在当前区间内出现了超过 2 次，那么+1转移，否则直接转移。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=202000*2;
const int Alpha=26;

class SAM{
public:
    int son[Alpha],len,fail,pos;
};

class SegmentData{
public:
    int ls,rs,cnt;
};

int n,samcnt=1,lst=1,root=1,F[maxN];
SAM Sm[maxN];
char Input[maxN];
vector<int> T[maxN];
int segcnt,rt[maxN];
SegmentData E[maxN*20];

void Extend(int c,int aps);
void Modify(int &x,int l,int r,int pos);
int Count(int x,int l,int r,int ql,int qr);
int Merge(int x,int y);
void dfs1(int x);
void dfs2(int x,int pos);
void outp(int x,int l,int r);

int main(){
    scanf("%d",&n);scanf("%s",Input+1);
    for (int i=1;i<=n;i++) Extend(Input[i]-'a',i),Modify(rt[lst],1,n,i);
    for (int i=2;i<=samcnt;i++) T[Sm[i].fail].push_back(i);
    dfs1(1);dfs2(1,1);int Ans=0;
    for (int i=2;i<=samcnt;i++) Ans=max(Ans,F[i]);
    printf("%d\n",Ans);return 0;
}

void Extend(int c,int aps){
    int np=++samcnt,p=lst;lst=samcnt;Sm[np].len=Sm[p].len+1;Sm[np].pos=aps;
    while (p&&Sm[p].son[c]==0) Sm[p].son[c]=np,p=Sm[p].fail;
    if (p==0) Sm[np].fail=root;
    else{
	int q=Sm[p].son[c];
	if (Sm[q].len==Sm[p].len+1) Sm[np].fail=q;
	else{
	    int nq=++samcnt;Sm[nq]=Sm[q];Sm[nq].len=Sm[p].len+1;
	    Sm[q].fail=Sm[np].fail=nq;
	    while (p&&Sm[p].son[c]==q) Sm[p].son[c]=nq,p=Sm[p].fail;
	}
    }
    return;
}
void Modify(int &x,int l,int r,int pos){
    if (x==0) x=++segcnt;++E[x].cnt;
    if (l==r) return;
    int mid=(l+r)>>1;
    if (pos<=mid) Modify(E[x].ls,l,mid,pos);else Modify(E[x].rs,mid+1,r,pos);
    return;
}
int Count(int x,int l,int r,int ql,int qr){
    if (x==0) return 0;
    if ((l==ql)&&(r==qr)) return E[x].cnt;
    int mid=(l+r)>>1;
    if (qr<=mid) return Count(E[x].ls,l,mid,ql,qr);
    else if (ql>=mid+1) return Count(E[x].rs,mid+1,r,ql,qr);
    else return Count(E[x].ls,l,mid,ql,mid)+Count(E[x].rs,mid+1,r,mid+1,qr);
}
int Merge(int x,int y){
    if ((!x)||(!y)) return x+y;
    int rt=++segcnt;
    E[rt].cnt=E[x].cnt+E[y].cnt;
    E[rt].ls=Merge(E[x].ls,E[y].ls);
    E[rt].rs=Merge(E[x].rs,E[y].rs);
    return rt;
}
void dfs1(int x){
    for (int i=0,sz=T[x].size();i<sz;i++) dfs1(T[x][i]),rt[x]=Merge(rt[x],rt[T[x][i]]);
    return;
}
void dfs2(int x,int pos){
    if (x!=pos){
	if (Sm[x].len==1) F[x]=1,pos=x;
	else if (Count(rt[pos],1,n,Sm[x].pos-Sm[x].len+Sm[pos].len,Sm[x].pos)>=2) F[x]=F[pos]+1,pos=x;
	else F[x]=F[pos];
    }
    for (int i=0,sz=T[x].size();i<sz;i++) dfs2(T[x][i],pos);
    return;
}
void outp(int x,int l,int r){
    if (x==0) return;
    if (l==r){
	cout<<l<<" ";return;
    }
    int mid=(l+r)>>1;
    outp(E[x].ls,l,mid);outp(E[x].rs,mid+1,r);
    return;
}
```